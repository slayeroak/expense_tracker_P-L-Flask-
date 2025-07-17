# backend/app/routes/bookings.py

from flask import Blueprint, abort, jsonify, request
from app.routes.expenses import (
    calc_food,
    calc_supplies,
    calc_labor
)

import csv
import os
import uuid

bookings_bp = Blueprint('bookings', __name__)

calculate_food_expense = calc_food
calculate_supplies_expense = calc_supplies
calculate_labor_expense = calc_labor

DATA_FILE = os.path.join(os.getcwd(), 'data', 'tailgate_bookings_list.csv')

def _load_bookings():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, newline='') as f:
        reader = csv.DictReader(f)
        rows = []
        for row in reader:
            # coerce numeric fields
            for key in [
                'event_deposit',
                'event_invoice_total',
                'total_event_labor_costs',
                'total_event_food_costs',
                'total_event_supplies_costs',
                'total_expense',
                'gross_profit'
            ]:
                try:
                    row[key] = float(row.get(key, 0) or 0)
                except ValueError:
                    row[key] = 0.0
            rows.append(row)
        return rows

def _save_booking(row):
    file_exists = os.path.exists(DATA_FILE)
    with open(DATA_FILE, mode='a', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=[
            'booking_id',
            'client_id',
            'event_name',
            'event_date',
            'event_deposit',
            'event_invoice_total',
            'total_event_labor_costs',
            'total_event_food_costs',
            'total_event_supplies_costs',
            'total_expense',
            'gross_profit'
        ])
        if not file_exists:
            writer.writeheader()
        writer.writerow(row)

@bookings_bp.route('/', methods=['GET'])
def get_bookings():
    """Return all bookings as JSON."""
    return jsonify(_load_bookings())

@bookings_bp.route('/', methods=['POST'])
def create_booking():
    data = request.get_json() or {}

    # — Required fields —
    client_id           = data.get('client_id', '')
    event_name          = data.get('event_name', '')
    event_date          = data.get('event_date', '')
    event_deposit       = float(data.get('event_deposit', 0))
    event_invoice_total = float(data.get('event_invoice_total', 0))

    if not (client_id and event_name and event_date):
        abort(400, "Missing required booking fields")

    # — Calculate each category via your pure functions —
    food_payload     = data.get('food', {})
    labor_payload    = data.get('labor', [])
    supplies_payload = data.get('supplies', [])

    total_food     = calculate_food_expense(
                        int(food_payload.get('headcount', 0)),
                        food_payload.get('menu', [])
                     )
    total_labor    = calculate_labor_expense(labor_payload)
    total_supplies = calculate_supplies_expense(supplies_payload)

    # — Derive totals & profit —
    total_expense = round(total_food + total_labor + total_supplies, 2)
    gross_profit  = round(event_invoice_total - total_expense, 2)

    # — Build the full booking record —
    booking_id = str(uuid.uuid4())[:8]
    row = {
        'booking_id': booking_id,
        'client_id': client_id,
        'event_name': event_name,
        'event_date': event_date,
        'event_deposit': event_deposit,
        'event_invoice_total': event_invoice_total,
        'total_event_food_costs': total_food,
        'total_event_labor_costs': total_labor,
        'total_event_supplies_costs': total_supplies,
        'total_expense': total_expense,
        'gross_profit': gross_profit
    }

    _save_booking(row)
    return jsonify(row), 201
