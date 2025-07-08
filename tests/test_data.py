import pytest
from app.data import load_pnl, load_pnl_sheet
# --------------------------------
# loop through every available sheet
# try to load it
# confirm you get a DataFrame (even if empty)
# print the first few rows for you to inspect
# --------------------------------
    
# you might manually get these from a preview or automate them later

@pytest.fixture(scope="session")
def all_sheets():
    return load_pnl("data/PnL_2025.xlsx")

def test_sheets_exist(all_sheets):
    assert len(all_sheets) > 0
    print(f"Found sheets: {all_sheets}")

@pytest.mark.parametrize("sheet_name", load_pnl("data/PnL_2025.xlsx"))
def test_load_all_sheets(sheet_name):
    df = load_pnl_sheet("data/PnL_2025.xlsx", sheet_name=sheet_name)
    assert df is not None
    print(f"Sheet {sheet_name} loaded")


