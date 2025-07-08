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

def main():
    while True:
        print("\n========== TAILGATE EXPENSE TRACKER ==========")
        print("Choose a section:")
        print("1. 🧾 Tailgate Expenses")
        print("2. 📅 Tailgate Bookings")
        print("3. Reports")
        print("4. ❌ Exit")

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

        elif section_choice == '3':
            print("\n📈 Reports")
            print("1. Total Revenue Report")
            sub_choice = input("Choose a report: ").strip()

            if sub_choice == '1':
                revenue_report()

        elif section_choice == "4":
            print("👋 Exiting Expense Tracker.")
            break

        else:
            print("❌ Invalid section. Please choose again.")

if __name__ == "__main__":
    main()