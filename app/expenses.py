import csv
import os

# Food Expense Functions
def manage_food_expenses():
    file_path = "data/food_catering_expense.csv"
    if not os.path.exists(file_path):
        print("❌ Food catering expense file not found.")
        return

    def read_expenses():
        items = {}
        with open(file_path, mode="r", newline="") as f:
            reader = csv.DictReader(f)
            for row in reader:
                items[row['item']] = {
                    'amount': row['amount'],
                    'quantity': row['quantity']
                }
        return items

    def write_expenses(data):
        with open(file_path, mode="w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=['item', 'amount', 'quantity'])
            writer.writeheader()
            for item, values in data.items():
                writer.writerow({'item': item, 'amount': values['amount'], 'quantity': values['quantity']})

    while True:
        print("\n📋 Food Expense Manager")
        print("1. View all items")
        print("2. Add new item")
        print("3. Edit existing item")
        print("4. Delete item")
        print("5. Exit")
        choice = input("Choose an option: ").strip()

        expenses = read_expenses()

        if choice == '1':
            for item, values in expenses.items():
                print(f"{item}: Amount = {values['amount']}, Quantity = {values['quantity']}")

        elif choice == '2':
            item = input("Item name: ").strip()
            amount = input("Item amount: ").strip()
            quantity = input("Item quantity: ").strip()
            expenses[item] = {'amount': amount, 'quantity': quantity}
            write_expenses(expenses)
            print("✅ Item added.")

        elif choice == '3':
            name = input("Enter item name to edit: ").strip()
            if name in expenses:
                expenses[name]['amount'] = input("New amount: ").strip()
                expenses[name]['quantity'] = input("New quantity: ").strip()
                write_expenses(expenses)
                print("✏️ Item updated.")
            else:
                print("❌ Item not found.")

        elif choice == '4':
            name = input("Enter item name to delete: ").strip()
            if name in expenses:
                del expenses[name]
                write_expenses(expenses)
                print("🗑️ Item deleted.")
            else:
                print("❌ Item not found.")

        elif choice == '5':
            break

        else:
            print("❌ Invalid choice. Try again.")    
            file_path = "data/food_catering_expense.csv"
    if not os.path.exists(file_path):
        print("❌ Food catering expense file not found.")
        return

    def read_expenses():
        items = {}
        with open(file_path, mode="r", newline="") as f:
            reader = csv.DictReader(f)
            for row in reader:
                items[row['item']] = {
                    'amount': row['amount'],
                    'quantity': row['quantity']
                }
        return items
        with open(file_path, mode="r", newline="") as f:
            return list(csv.DictReader(f))

    def write_expenses(data):
        with open(file_path, mode="w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=['item', 'amount', 'quantity'])
            writer.writeheader()
            for item, values in data.items():
                writer.writerow({'item': item, 'amount': values['amount'], 'quantity': values['quantity']})
            writer.writeheader()
            writer.writerows(data)

    while True:
        print("\n📋 Food Expense Manager")
        print("1. View all items")
        print("2. Add new item")
        print("3. Edit existing item")
        print("4. Delete item")
        print("5. Exit")
        choice = input("Choose an option: ").strip()

        expenses = read_expenses()

        if choice == '1':
            for row in expenses:
                print(row)

        elif choice == '2':
            item = input("Item name: ").strip()
            amount = input("Item amount: ").strip()
            quantity = input("Item quantity: ").strip()
            expenses.append({'item': item, 'amount': amount, 'quantity': quantity})
            write_expenses(expenses)
            print("✅ Item added.")

        elif choice == '3':
            name = input("Enter item name to edit: ").strip()
            updated = False
            for row in expenses:
                if row['item'] == name:
                    row['amount'] = input("New amount: ").strip()
                    row['quantity'] = input("New quantity: ").strip()
                    updated = True
            if updated:
                write_expenses(expenses)
                print("✏️ Item updated.")
            else:
                print("❌ Item not found.")

        elif choice == '4':
            name = input("Enter item name to delete: ").strip()
            filtered = [row for row in expenses if row['item'] != name]
            if len(filtered) != len(expenses):
                write_expenses(filtered)
                print("🗑️ Item deleted.")
            else:
                print("❌ Item not found.")

        elif choice == '5':
            break

        else:
            print("❌ Invalid choice. Try again.")

def food_expense_calculator():
    file_path = "data/food_catering_expense.csv"
    if not os.path.exists(file_path):
        print("❌ Food catering expense file not found.")
        return 0.0

    try:
        headcount = int(input("Enter headcount for this tailgate: "))
    except ValueError:
        print("Invalid headcount. Defaulting to 0.")
        headcount = 0

    total_food_cost = 0.0
    food_items = {}  # Dictionary where key is item name and value is {'amount': x, 'quantity': y}

    with open(file_path, mode="r", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            item = row['item']
            food_items[item] = {
                'amount': float(row['amount']),
                'quantity': int(row['quantity'])
            }

        for item, values in food_items.items():
            include = str(input(f"Include '{item}' on the menu? (y/n): ")).strip().lower()
        if include == 'y':
            units_needed = headcount / values['quantity']
            item_total = units_needed * values['amount']
            print(f"✔️ {item} cost: ${item_total:.2f} (headcount {headcount} / {values['quantity']} units * ${values['amount']:.2f})")
            total_food_cost += item_total
        else:
            print(f"⏭️ Skipping {item}")

    print(f"Total food cost for this tailgate: ${total_food_cost:.2f}")
    return total_food_cost

#Tailgate Suppliues Expense Functions
def manage_supplies_expenses():
    file_path = "data/tailgate_supplies_expense.csv"
    if not os.path.exists(file_path):
        print("❌ Supplies expense file not found.")
        return

    def read_expenses():
        items = {}
        with open(file_path, mode="r", newline="") as f:
            reader = csv.DictReader(f)
            for row in reader:
                items[row['item']] = float(row['amount'])
        return items

    def write_expenses(data):
        with open(file_path, mode="w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=['item', 'amount'])
            writer.writeheader()
            for item, amount in data.items():
                writer.writerow({'item': item, 'amount': amount})

    while True:
        print("Supplies Expense Manager")
        print("1. View all items")
        print("2. Add new item")
        print("3. Edit existing item")
        print("4. Delete item")
        print("5. Exit")
        choice = input("Choose an option: ").strip()

        expenses = read_expenses()

        if choice == '1':
            for item, amount in expenses.items():
                print(f"{item}: ${amount}")

        elif choice == '2':
            item = input("Item name: ").strip()
            amount = input("Item amount: ").strip()
            expenses[item] = amount
            write_expenses(expenses)
            print("✅ Item added.")

        elif choice == '3':
            name = input("Enter item name to edit: ").strip()
            if name in expenses:
                amount = input("New amount: ").strip()
                expenses[name] = amount
                write_expenses(expenses)
                print("✏️ Item updated.")
            else:
                print("❌ Item not found.")

        elif choice == '4':
            name = input("Enter item name to delete: ").strip()
            if name in expenses:
                del expenses[name]
                write_expenses(expenses)
                print("🗑️ Item deleted.")
            else:
                print("❌ Item not found.")

        elif choice == '5':
            break

        else:
            print("❌ Invalid choice. Try again.")

def supplies_expense_calculator():
    file_path = "data/tailgate_supplies_expense.csv"
    if not os.path.exists(file_path):
        print("❌ Supplies expense file not found.")
        return 0.0

    total_supplies_cost = 0.0

    with open(file_path, mode="r", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            item = row['item']
            amount = float(row['amount'])
            include = input(f"Include '{item}' in the tailgate supplies? (y/n): ").strip().lower()
            if include == 'y':
                quantity_needed = input(f"Enter quantity needed for '{item}': ").strip()
                try:
                    quantity_needed = int(quantity_needed)
                    item_total = quantity_needed * amount
                    print(f"✔️ {item} cost: ${item_total:.2f} ({quantity_needed} * ${amount:.2f})")
                    total_supplies_cost += item_total
                except ValueError:
                    print("Invalid quantity. Skipping item.")
            else:
                print(f"⏭️ Skipping {item}")

    print(f"\n🧰 Total supplies cost for this tailgate: ${total_supplies_cost:.2f}")
    return total_supplies_cost

# Tailgate Labor Expense Functions
def manage_labor_expenses():
    file_path = "data/labor_expense.csv"

    def read_labor_data():
        labor_data = {}
        if not os.path.exists(file_path):
            return labor_data
        with open(file_path, mode="r", newline="") as f:
            reader = csv.DictReader(f)
            for row in reader:
                role = row['labor_role']
                event_type = row['event_type']
                cost = float(row['cost'])
                if role not in labor_data:
                    labor_data[role] = {}
                labor_data[role][event_type] = cost
        return labor_data

    def write_labor_data(data):
        with open(file_path, mode="w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=["labor_role", "event_type", "cost"])
            writer.writeheader()
            for role, event_costs in data.items():
                for event_type, cost in event_costs.items():
                    writer.writerow({
                        "labor_role": role,
                        "event_type": event_type,
                        "cost": cost
                    })

    while True:
        print("\n🛠 Labor Expense Manager")
        print("1. View labor roles and costs")
        print("2. Add/Edit labor role and event types")
        print("3. Delete labor role")
        print("4. Exit")
        choice = input("Choose an option: ").strip()

        labor_data = read_labor_data()

        if choice == '1':
            for role, event_costs in labor_data.items():
                print(f"\n{role}:")
                for event, cost in event_costs.items():
                    print(f"  - {event}: ${cost:.2f}")

        elif choice == '2':
            role = input("Enter labor role: ").strip()
            if role not in labor_data:
                labor_data[role] = {}
            while True:
                event = input("Enter event type (or type 'done' to finish): ").strip()
                if event.lower() == 'done':
                    break
                try:
                    cost = float(input(f"Enter labor cost for {event}: ").strip())
                    labor_data[role][event] = cost
                except ValueError:
                    print("❌ Invalid cost. Try again.")
            write_labor_data(labor_data)
            print("✅ Labor role and events updated.")

        elif choice == '3':
            role = input("Enter labor role to delete: ").strip()
            if role in labor_data:
                del labor_data[role]
                write_labor_data(labor_data)
                print("🗑️ Labor role deleted.")
            else:
                print("❌ Labor role not found.")

        elif choice == '4':
            break
        else:
            print("❌ Invalid choice. Please try again.")

def labor_expense_calculator():
    file_path = "data/labor_expense.csv"
    if not os.path.exists(file_path):
        print("❌ Labor expense file not found.")
        return 0.0

    labor_data = {}
    with open(file_path, mode="r", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            role = row["labor_role"]
            event_type = row["event_type"]
            cost = float(row["cost"])
            if role not in labor_data:
                labor_data[role] = {}
            labor_data[role][event_type] = cost

    total_labor_cost = 0.0
    for role, events in labor_data.items():
        use_role = input(f"Include {role} in labor calculation? (y/n): ").strip().lower()
        if use_role == 'y':
            event = input(f"Enter event type for {role} (options: {', '.join(events.keys())}): ").strip()
            if event not in events:
                print(f"❌ Event type '{event}' not found for {role}. Skipping.")
                continue
            try:
                num = int(input(f"How many {role}s for {event}? "))
                subtotal = num * events[event]
                print(f"  ➕ {num} × ${events[event]} = ${subtotal:.2f}")
                total_labor_cost += subtotal
            except ValueError:
                print("❌ Invalid number entered. Skipping.")

    print(f"\n💰 Total Labor Cost: ${total_labor_cost:.2f}")
    return total_labor_cost


