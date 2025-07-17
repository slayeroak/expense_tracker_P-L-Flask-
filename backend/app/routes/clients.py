
from flask import Blueprint, jsonify, request, abort
import csv
import os
import uuid

clients_bp = Blueprint('clients', __name__)

# Path to your CSV data file
DATA_FILE = os.path.join(os.getcwd(), 'data', 'clients.csv')
# CSV columns
FIELDNAMES = ["client_id", "first_name", "last_name", "email", "phone", "past_events", "notes"]

def _load_clients():
    """Read clients.csv into a list of dicts."""
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, newline='') as f:
        return list(csv.DictReader(f))

def _save_clients(clients):
    """Write a list of client dicts back to clients.csv."""
    with open(DATA_FILE, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(clients)

@clients_bp.route('/', methods=['GET'])
def get_clients():
    """Return all clients as JSON."""
    return jsonify(_load_clients())

@clients_bp.route('/', methods=['POST'])
def create_client():
    """Create a new client from JSON payload."""
    data = request.get_json() or {}
    new_client = {
        "client_id": str(uuid.uuid4())[:8],
        "first_name": data.get("first_name", ""),
        "last_name":  data.get("last_name", ""),
        "email":      data.get("email", ""),
        "phone":      data.get("phone", ""),
        "past_events":data.get("past_events", ""),
        "notes":      data.get("notes", "")
    }
    clients = _load_clients()
    clients.append(new_client)
    _save_clients(clients)
    return jsonify(new_client), 201

@clients_bp.route('/<client_id>', methods=['PUT'])
def update_client(client_id):
    """
    Update an existing client.
    Expects JSON with any of the client fields (except client_id).
    """
    clients = _load_clients()
    for c in clients:
        if c["client_id"] == client_id:
            data = request.get_json() or {}
            for field in FIELDNAMES:
                if field in data and field != "client_id":
                    c[field] = data[field]
            _save_clients(clients)
            return jsonify(c)
    abort(404, description="Client not found")

@clients_bp.route('/<client_id>', methods=['DELETE'])
def delete_client(client_id):
    """Delete a client by ID."""
    clients = _load_clients()
    filtered = [c for c in clients if c["client_id"] != client_id]
    if len(filtered) == len(clients):
        abort(404, description="Client not found")
    _save_clients(filtered)
    return '', 204

@clients_bp.route('/report', methods=['GET'])
def client_report():
    """
    Return a client activity report: for each client, list their bookings.
    """
    # load clients
    clients = _load_clients()

    # load bookings
    bookings_file = os.path.join(os.getcwd(), 'data', 'tailgate_bookings_list.csv')
    bookings = []
    if os.path.exists(bookings_file):
        with open(bookings_file, newline='') as f:
            bookings = list(csv.DictReader(f))

    # build report
    report = []
    for c in clients:
        client_bookings = [b for b in bookings if b.get("client_id") == c["client_id"]]
        report.append({
            "client": c,
            "bookings": client_bookings
        })

    return jsonify(report)