import csv
import os
import uuid
from flask import Blueprint, jsonify, request, abort

clients_bp = Blueprint('clients', __name__)

DATA_DIR  = os.path.join(os.getcwd(), 'data')
DATA_FILE = os.path.join(DATA_DIR, 'clients.csv')
FIELDNAMES = ["client_id", "first_name", "last_name", "email", "phone", "past_events", "notes"]

def _ensure_data_file():
    # 1) Make sure the data/ folder exists
    os.makedirs(DATA_DIR, exist_ok=True)
    # 2) If the CSV doesn’t exist yet, create it with a header row
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, mode='w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
            writer.writeheader()

def _load_clients():
    _ensure_data_file()
    with open(DATA_FILE, mode='r', newline='') as f:
        return list(csv.DictReader(f))

def _save_clients(clients):
    _ensure_data_file()
    with open(DATA_FILE, mode='w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(clients)

@clients_bp.route('/', methods=['GET'])
def get_clients():
    return jsonify(_load_clients())

@clients_bp.route('/', methods=['POST'])
def create_client():
    data = request.get_json() or {}
    # validate required fields
    for field in ["first_name", "last_name", "email"]:
        if not data.get(field):
            abort(400, f"Missing required field: {field}")

    clients = _load_clients()
    new_client = {
        "client_id":   str(uuid.uuid4())[:8],
        "first_name":  data["first_name"],
        "last_name":   data["last_name"],
        "email":       data["email"],
        "phone":       data.get("phone", ""),
        "past_events": data.get("past_events", ""),
        "notes":       data.get("notes", "")
    }
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