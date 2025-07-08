from app.bookings import (
    save_tailgate_booking,
    list_tailgate_bookings,
    create_tailgate_booking,
    edit_tailgate_booking,
    delete_tailgate_booking,
)
from app.expenses import  (
    manage_food_expenses,
    manage_supplies_expenses,
    manage_labor_expenses
)

from app.data import (
    revenue_report
)

from app.clients import (
    create_new_client,
    edit_client,
    delete_client,
    generate_client_activity_report
)

def main():
    while True:
        print("\n========== TAILGATE EXPENSE TRACKER ==========")
        print("Choose a section:")
        print("1. 🧾 Tailgate Expenses")
        print("2. 📅 Tailgate Bookings")
        print("3. 📅 Tailgate Clients")
        print("4. Reports")
        print("5. ❌ Exit")

        section_choice = input("Select section (1-3): ").strip()

        if section_choice == "1":
            while True:
                print("\n📂 Tailgate Expenses")
                print("1. Manage Food Expense")
                print("2. Manage Suuplies Expense")
                print("3. Manage Labor Expense")
                print("4. Back to main Menu")

                choice = input("Select an option (1-4): ").strip()

                if choice == "1":
                    manage_food_expenses()
                elif choice == "2":
                    manage_supplies_expenses()
                elif choice == "3":
                    manage_labor_expenses()
                elif choice == "4":
                    break
                else:
                    print("❌ Invalid option. Please try again.")

        elif section_choice == "2":
            while True:
                print("\n📂 Tailgate Bookings")
                print("1. Create Tailgate Booking")
                print("2. List All Bookings")
                print("3. View Booking by ID")
                print("4. Edit Booking by ID")
                print("5. Delete Booking by ID")
                print("6. ⬅️ Back to Main Menu")

                choice = input("Select an option (1-6): ").strip()

                if choice == "1":
                    create_tailgate_booking()
                elif choice == "2":
                    date_filter = input("Filter by date (YYYY-MM-DD) or press enter to show all: ").strip()
                    list_tailgate_bookings(filter_by_date=date_filter if date_filter else None)
                elif choice == "3":
                    booking_id = input("Enter Booking ID: ").strip()
                    list_tailgate_bookings(filter_by_id=booking_id)
                elif choice == "4":
                    booking_id = input("Enter Booking ID to edit: ").strip()
                    print("Enter new values (leave blank to skip):")
                    updated_fields = {}
                    for field in [
                        "event_name",
                        "event_date",
                        "event_deposit",
                        "event_invoice_total"
                    ]:
                        value = input(f"{field}: ").strip()
                        if value:
                            updated_fields[field] = value
                    edit_tailgate_booking(booking_id, updated_fields)
                elif choice == "5":
                    booking_id = input("Enter Booking ID to delete: ").strip()
                    delete_tailgate_booking(booking_id)
                elif choice == "6":
                    break
                else:
                    print("❌ Invalid option. Please try again.")

        elif section_choice == "3":
            while True:
                print("\n👥 Client Management")
                print("1. Add Client")
                print("2. Edit Client")
                print("3. Delete Client")
                print("4. Client Activity Report")
                print("5. ⬅️ Back to Main Menu")

                sub_choice = input("Choose an option: ").strip()
                if sub_choice == "1":
                    create_new_client()
                elif sub_choice == "2":
                    edit_client()
                elif sub_choice == "3":
                    delete_client()
                elif sub_choice == '4':
                    generate_client_activity_report()
                elif choice == "5":
                    break
                else:
                    print("❌ Invalid option. Please try again.")

        elif section_choice == '4':
            print("\n📈 Reports")
            print("1. Total Revenue Report")
            sub_choice = input("Choose a report: ").strip()

            if sub_choice == '1':
                revenue_report()

        elif section_choice == "5":
            print("👋 Exiting Expense Tracker.")
            break

        else:
            print("❌ Invalid section. Please choose again.")

if __name__ == "__main__":
    main()