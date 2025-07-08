Philly Tailgate Expense Tracker (Real-Time)

A real-time expense tracking system tailored for managing tailgate events in Philadelphia. This application helps organizers monitor costs associated with bookings, labor, food, and supplies, while keeping the data organized and accessible through a command-line interface.


🚀 Features
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Add and manage tailgate event bookings.
    - Basic CRUD operations
        - Create, load and manipulate bookings data in CSV expense data.
    - Unique id
    - Aggregate and analyze tailgate revenue and expenses by event ,month or annually.

Track individual expense categories: food, labor, supplies.
    - Basic CRUD operations
        - Create, load and manipulate expense data in CSV expense data.
    Custom expense calculators that utelize expense category data to populate tailgate expense fields

Run CLI-based commands to interact with your data in real time.

Built-in testing suite for development assurance.
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

🛠 Installation
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Clone the repo:


git clone <your-repo-url>
cd Philly_Tailgate_Expense_Tracker_Real_Time_P
Install dependencies:
It's recommended to use a virtual environment.


conda create -n tailgate_tracker python=3.10
conda activate tailgate_tracker
pip install -r requirements.txt
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


💻 Usage
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
To run the application from the root directory:
python run.py

This will initiate the CLI interface where you can run commands for:
booking handling, expense handlding, data aggregation and more
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


📁 Project Structure
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Philly_Tailgate_Expense_Tracker_Real_Time_P/
│
├── app/
│   ├── __init__.py           # App entry point
│   ├── bookings.py           # Booking-related functionality
│   ├── expenses.py           # Expense aggregation and logic
│   ├── models.py             # Data structures and schemas
│   ├── cli.py                # CLI interface commands
│   ├── data.py               # Data loading helpers
│   └── utils.py              # Misc utility functions
│
├── data/                     # Raw CSV data for events and expenses
│   ├── tailgate_bookings_list.csv
│   ├── tailgate_supplies_expense.csv
│   ├── labor_expense.csv
│   └── food_catering_expense.csv
│
├── tests/                    # Unit tests
│   ├── test_app_functions.py
│   ├── test_data.py
│   └── __init__.py
│
├── run.py                    # Main runner script
├── requirements.txt          # Python dependencies
└── README.md                 # Project documentation
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


📊 Data Sources
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
tailgate_bookings_list.csv – Event booking details

food_catering_expense.csv – Catering costs

labor_expense.csv – Staff and labor costs

tailgate_supplies_expense.csv – General tailaatesupply costs
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


✅ Running Tests
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
To run the test suite:
pytest
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


📦 Requirements
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Dependencies are listed in requirements.txt. Includes:

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------




📄 License
MIT License — feel free to use, share, and contribute.

