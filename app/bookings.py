import csv
import os
from app.expenses import food_expense_calculator, labor_expense_calculator, supplies_expense_calculator
from app.clients import select_client

import uuid

def save_tailgate_booking(booking_id, client_id, event_name, event_date, event_deposit, event_invoice_total, total_food, total_labor, total_supplies, total_expense, gross_profit):
    file_path = "data/tailgate_bookings_list.csv"
    file_exists = os.path.exists(file_path)

    with open(file_path, mode="a", newline="") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow([
                "booking_id",
                "client_id"
                "event_name",
                "event_date",
                "event_deposit",
                "event_invoice_total",
                "total_event_labor_costs",
                "total_event_food_costs",
                "total_event_supplies_costs",
                "total_expense",
                "gross_profit"
            ])

        writer.writerow([
            booking_id,
            client_id,
            event_name,
            event_date,
            f"{event_deposit:.2f}",
            f"{event_invoice_total:.2f}",
            total_food,
            total_labor,
            total_supplies,
            total_expense,
            f"{gross_profit:.2f}"
        ])

    print(f"✅ Booking saved: {event_name} on {event_date} with ID {booking_id} and total ${total_expense}")

def list_tailgate_bookings(filter_by_date=None, filter_by_id=None):
    file_path = "data/tailgate_bookings_list.csv"
    if not os.path.exists(file_path):
        print("📭 No bookings found.")
        return

    with open(file_path, mode="r") as f:
        reader = csv.DictReader(f)
        print("📅 Tailgate Bookings:")
        for row in reader:
            if filter_by_date and row["event_date"] != filter_by_date:
                continue
            if filter_by_id and row["booking_id"] != filter_by_id:
                continue
            print(f"- ID: {row['booking_id']} | {row['event_name']} | {row['event_date']} | ${row['total_expense']}")

def edit_tailgate_booking(booking_id, updated_fields):
    file_path = "data/tailgate_bookings_list.csv"
    if not os.path.exists(file_path):
        print("❌ Booking file not found.")
        return

    updated = False
    with open(file_path, mode="r") as f:
        rows = list(csv.DictReader(f))

    with open(file_path, mode="w", newline="") as f:
        fieldnames = ["booking_id", "event_name", "event_date", "event_deposit", "event_invoice_total", "total_event_labor_costs", "total_event_food_costs", "total_event_supplies_costs", "total_expense",]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            if row["booking_id"] == booking_id:
                row.update(updated_fields)
                updated = True
            writer.writerow(row)

    if updated:
        print(f"✏️ Booking {booking_id} updated successfully.")
    else:
        print(f"❌ Booking ID {booking_id} not found.")

def delete_tailgate_booking(booking_id):
    file_path = "data/tailgate_bookings_list.csv"
    if not os.path.exists(file_path):
        print("❌ Booking file not found.")
        return

    updated_rows = []
    deleted = False
    with open(file_path, mode="r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row["booking_id"] == booking_id:
                deleted = True
                continue
            updated_rows.append(row)

    with open(file_path, mode="w", newline="") as f:
        fieldnames = ["booking_id", "event_name", "event_date", "event_deposit", "event_invoice_total", "total_event_labor_costs", "total_event_food_costs", "total_event_supplies_costs", "total_expense"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(updated_rows)

    if deleted:
        print(f"🗑️ Booking {booking_id} deleted successfully.")
    else:
        print(f"❌ Booking ID {booking_id} not found.")

def create_tailgate_booking():
    print("\n📋 Create New Tailgate Booking")
    client = select_client()
    event_name = input("Event name (e.g. Eagles vs Cowboys): ").strip()
    event_date = input("Event date (YYYY-MM-DD): ").strip()
    event_deposit = float(input("Deposit received (e.g. 500.00): ").strip())
    event_invoice_total = float(input("Invoice total (e.g. 1500.00): ").strip())
    print("\n⚙️ Running expense calculators...")
    total_food = food_expense_calculator()
    total_labor = labor_expense_calculator()
    total_supplies = supplies_expense_calculator()
    total_expense = total_food + total_labor + total_supplies
    booking_id = str(uuid.uuid4())[:8]  # short unique ID
    gross_profit = event_invoice_total - total_expense
    save_tailgate_booking(booking_id, client["client_id"], event_name, event_date, event_deposit, event_invoice_total, total_food, total_labor, total_supplies, total_expense, gross_profit)

