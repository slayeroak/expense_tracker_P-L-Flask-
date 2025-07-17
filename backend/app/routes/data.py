import pandas as pd
import csv
import os
import matplotlib.pyplot as plt
from collections import defaultdict
from datetime import datetime

# Load the Excel file
file_path = "/Users/ryanoakley/Desktop/Philly_Tailgate_Expense_Tracker_Real_Time_P/data/Philly Tailgate - Business P&L _ Cash Planning 2025.xlsx"


# ---------------------------
# Load Financials
# ---------------------------
def revenue_report():
    print("\n📊 Tailgate Financial Report")
    calculate_total_revenue()
    monthly_revenue_report()
    calculate_total_category_expenses()
    calculate_monthly_category_expenses()
    total_gross_profit_report()
    show_monthly_gross_profit_trends()
# --------------------------------
# Revenue Handling Functions
# --------------------------------
def calculate_total_revenue():
    file_path = "data/tailgate_bookings_list.csv"
    total_revenue = 0.0

    if not os.path.exists(file_path):
        print("📭 No bookings found.")
        return total_revenue

    with open(file_path, mode="r", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                total_revenue += float(row.get("event_invoice_total", 0) or 0)
            except ValueError:
                print(f"⚠️ Invalid invoice amount in row: {row}")

    print(f"💰 Total Revenue from all bookings: ${total_revenue:.2f}")
    return total_revenue

def monthly_revenue_report():
    file_path = "data/tailgate_bookings_list.csv"
    revenue_by_month = defaultdict(float)

    if not os.path.exists(file_path):
        print("📭 No bookings file found.")
        return

    with open(file_path, mode="r", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            date_str = row.get("event_date", "")
            invoice_str = row.get("event_invoice_total", "0")

            try:
                date_obj = datetime.strptime(date_str, "%Y-%m-%d")
                month_key = date_obj.strftime("%Y-%m")
                revenue = float(invoice_str)
                revenue_by_month[month_key] += revenue
            except (ValueError, TypeError):
                print(f"⚠️ Skipping invalid row: {row}")

    if not revenue_by_month:
        print("📉 No valid data to display.")
        return

    print("\n📆 Monthly Revenue Report:")
    for month in sorted(revenue_by_month):
        print(f"- {month}: ${revenue_by_month[month]:.2f}")

def total_gross_profit_report():
    file_path = "data/tailgate_bookings_list.csv"
    if not os.path.exists(file_path):
        print("❌ No bookings found.")
        return

    total_profit = 0.0
    with open(file_path, mode="r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                profit = float(row.get("gross_profit", 0) or 0)
            except (ValueError, TypeError):
                profit = 0.0
            total_profit += profit

    print(f"\n💰 Total Gross Profit Across All Tailgates: ${total_profit:.2f}")

def show_monthly_gross_profit_trends():
    file_path = "data/tailgate_bookings_list.csv"
    if not os.path.exists(file_path):
        print("❌ Booking file not found.")
        return

    monthly_profits = defaultdict(float)
    with open(file_path, mode="r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if "event_date" in row and "gross_profit" in row:
                try:
                    date_obj = datetime.strptime(row["event_date"], "%Y-%m-%d")
                    month = date_obj.strftime("%Y-%m")
                    value = row.get("gross_profit")
                    monthly_profits[month] += float(value or 0.0)
                except (ValueError, KeyError):
                    continue

    print("\n📈 Monthly Gross Profit Trends:")
    for month in sorted(monthly_profits):
        print(f"{month}: ${monthly_profits[month]:.2f}")

        # Sort the months and values
        months_sorted = sorted(monthly_profits.keys())
        profits_sorted = [monthly_profits[month] for month in months_sorted]

        # Plot the results
        plt.figure(figsize=(10, 5))
        plt.plot(months_sorted, profits_sorted, marker='o', linestyle='-', linewidth=2)
        plt.title("📈 Monthly Gross Profit Trends")
        plt.xlabel("Month")
        plt.ylabel("Gross Profit ($)")
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.grid(True)
        plt.show()
# --------------------------------
# Expense Handling Functions
# --------------------------------
def calculate_total_category_expenses():
    file_path = "data/tailgate_bookings_list.csv"
    if not os.path.exists(file_path):
        print("❌ Booking file not found.")
        return

    total_food = 0.0
    total_labor = 0.0
    total_supplies = 0.0

    with open(file_path, mode="r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                total_food += float(row["total_event_food_costs"])
                total_labor += float(row["total_event_labor_costs"])
                total_supplies += float(row["total_event_supplies_costs"])
            except ValueError:
                print(f"⚠️ Skipping malformed row: {row}")

    print("\n📊 Total Expenses Across All Tailgates:")
    print(f"- 🍔 Total Food Expenses: ${total_food:.2f}")
    print(f"- 🧑‍🔧 Total Labor Expenses: ${total_labor:.2f}")
    print(f"- 🧂 Total Supplies Expenses: ${total_supplies:.2f}")

    return total_food, total_labor, total_supplies

def calculate_monthly_category_expenses():
    file_path = "data/tailgate_bookings_list.csv"
    if not os.path.exists(file_path):
        print("❌ Booking file not found.")
        return

    # Structure: {'2025-06': {'food': 0, 'labor': 0, 'supplies': 0}}
    monthly_expenses = defaultdict(lambda: {"food": 0.0, "labor": 0.0, "supplies": 0.0})

    with open(file_path, mode="r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                date = datetime.strptime(row["event_date"], "%Y-%m-%d")
                month_key = date.strftime("%Y-%m")
                monthly_expenses[month_key]["food"] += float(row["total_event_food_costs"])
                monthly_expenses[month_key]["labor"] += float(row["total_event_labor_costs"])
                monthly_expenses[month_key]["supplies"] += float(row["total_event_supplies_costs"])
            except (ValueError, KeyError) as e:
                print(f"⚠️ Skipping malformed row: {row} — {e}")

    print("\n📆 Monthly Expenses Breakdown:")
    for month in sorted(monthly_expenses):
        print(f"\n📅 {month}")
        print(f"  🍔 Food: ${monthly_expenses[month]['food']:.2f}")
        print(f"  🧑‍🔧 Labor: ${monthly_expenses[month]['labor']:.2f}")
        print(f"  🧂 Supplies: ${monthly_expenses[month]['supplies']:.2f}")