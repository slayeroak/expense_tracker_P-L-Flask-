import csv
import os
import uuid

CLIENTS_FILE = "data/clients.csv"

def load_clients():
    if not os.path.exists(CLIENTS_FILE):
        return []
    with open(CLIENTS_FILE, mode="r") as f:
        return list(csv.DictReader(f))

def save_clients(clients):
    with open(CLIENTS_FILE, mode="w", newline="") as f:
        fieldnames = ["client_id", "first_name", "last_name", "email", "phone", "past_events", "notes"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(clients)

def create_new_client():
    print("\n👤 Create New Client")
    client = {
        "client_id": str(uuid.uuid4())[:8],
        "first_name": input("First name: ").strip(),
        "last_name": input("Last name: ").strip(),
        "email": input("Email: ").strip(),
        "phone": input("Phone: ").strip(),
        "past_events": input("Past events or refereals (comma separated): ").strip(),
        "notes": input("Notes: ").strip()
    }
    clients = load_clients()
    clients.append(client)
    save_clients(clients)
    print(f"✅ Client {client['first_name']} {client['last_name']} added.")
    return client

def edit_client():
    file_path = "data/clients.csv"
    if not os.path.exists(file_path):
        print("📭 No clients found.")
        return

    with open(file_path, mode="r") as f:
        clients = list(csv.DictReader(f))

    if not clients:
        print("📭 No clients to edit.")
        return

    print("👥 Clients:")
    for i, client in enumerate(clients, start=1):
        print(f"{i}. {client['first_name']} {client['last_name']} ({client['client_id']})")

    choice = input("Enter client number to edit: ").strip()
    if not choice.isdigit() or not (1 <= int(choice) <= len(clients)):
        print("❌ Invalid choice.")
        return

    client = clients[int(choice) - 1]
    print("✏️ Leave blank to keep current value.")
    for key in ["first_name", "last_name", "email", "phone", "preferred_event_types", "notes"]:
        new_val = input(f"{key.replace('_', ' ').title()} ({client[key]}): ").strip()
        if new_val:
            client[key] = new_val

    with open(file_path, mode="w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=clients[0].keys())
        writer.writeheader()
        writer.writerows(clients)

    print("✅ Client updated.")

def delete_client():
    file_path = "data/clients.csv"
    if not os.path.exists(file_path):
        print("📭 No clients found.")
        return

    with open(file_path, mode="r") as f:
        clients = list(csv.DictReader(f))

    if not clients:
        print("📭 No clients to delete.")
        return

    print("👥 Clients:")
    for i, client in enumerate(clients, start=1):
        print(f"{i}. {client['first_name']} {client['last_name']} ({client['client_id']})")

    choice = input("Enter client number to delete: ").strip()
    if not choice.isdigit() or not (1 <= int(choice) <= len(clients)):
        print("❌ Invalid choice.")
        return

    deleted = clients.pop(int(choice) - 1)

    with open(file_path, mode="w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=clients[0].keys())
        writer.writeheader()
        writer.writerows(clients)

    print(f"🗑️ Deleted client: {deleted['first_name']} {deleted['last_name']}")

def select_client():
    clients = load_clients()
    if not clients:
        print("📭 No clients found. Creating new client...")
        return create_new_client()

    print("\n📇 Existing Clients:")
    for i, client in enumerate(clients, 1):
        print(f"{i}. {client['first_name']} {client['last_name']} ({client['email']})")

    choice = input("Select client number or type 'new' to create a new client: ").strip()
    if choice.lower() == "new":
        return create_new_client()
    try:
        return clients[int(choice)-1]
    except (ValueError, IndexError):
        print("❌ Invalid choice. Creating new client.")
        return create_new_client()
    
def generate_client_activity_report():
    clients_path = "data/clients.csv"
    bookings_path = "data/tailgate_bookings_list.csv"

    if not os.path.exists(clients_path) or not os.path.exists(bookings_path):
        print("❌ Required data files not found.")
        return

    with open(clients_path, mode="r") as f:
        clients = list(csv.DictReader(f))

    with open(bookings_path, mode="r") as f:
        bookings = list(csv.DictReader(f))

    client_dict = {c['client_id']: c for c in clients}

    print("\n📋 Client Activity Report")
    for client_id, client in client_dict.items():
        print(f"\n👤 {client['first_name']} {client['last_name']} ({client['email']})")
        print("📞 Phone:", client['phone'])
        print("⭐ Past Events:", client['past_events'])
        print("📝 Notes:", client['notes'])
        print("📅 Bookings:")

        client_bookings = [b for b in bookings if b['client_id'] == client_id]
        if not client_bookings:
            print("   - No bookings found.")
        else:
            for b in client_bookings:
                print(f"   - {b['event_name']} on {b['event_date']} | Invoice: ${b['event_invoice_total']} | Total Cost: ${b['total_expense']}")