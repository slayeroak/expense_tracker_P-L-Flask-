# backend/app/routes/expenses.py

from flask import Blueprint, jsonify, request, abort
import csv, os

expenses_bp = Blueprint('expenses', __name__)
DATA_DIR = os.path.join(os.getcwd(), 'data')

### --- FOOD CRUD --- ###
FOOD_CSV = os.path.join(DATA_DIR, 'food_catering_expense.csv')
FOOD_FIELDS = ['item','amount','quantity']

def _load_food():
    if not os.path.exists(FOOD_CSV):
        return []
    with open(FOOD_CSV, newline='') as f:
        return list(csv.DictReader(f))

def _save_food(rows):
    with open(FOOD_CSV, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=FOOD_FIELDS)
        writer.writeheader()
        writer.writerows(rows)

@expenses_bp.route('/food', methods=['GET'])
def list_food():
    return jsonify(_load_food())

@expenses_bp.route('/food', methods=['POST'])
def add_food():
    data = request.get_json() or {}
    if not data.get('item'):
        abort(400, 'Missing item')
    row = {
        'item': data['item'],
        'amount': data.get('amount','0'),
        'quantity': data.get('quantity','1')
    }
    rows = _load_food()
    rows.append(row)
    _save_food(rows)
    return jsonify(row), 201

@expenses_bp.route('/food/<item>', methods=['PUT'])
def edit_food(item):
    data = request.get_json() or {}
    rows = _load_food()
    updated=False
    for r in rows:
        if r['item'] == item:
            r['amount']   = data.get('amount', r['amount'])
            r['quantity'] = data.get('quantity', r['quantity'])
            updated = True
    if not updated:
        abort(404, 'Item not found')
    _save_food(rows)
    return jsonify({'item':item}), 200

@expenses_bp.route('/food/<item>', methods=['DELETE'])
def delete_food(item):
    rows = [r for r in _load_food() if r['item'] != item]
    _save_food(rows)
    return '', 204


### --- SUPPLIES CRUD --- ###
SUPP_CSV = os.path.join(DATA_DIR, 'tailgate_supplies_expense.csv')
SUPP_FIELDS = ['item','amount']

def _load_supplies():
    if not os.path.exists(SUPP_CSV):
        return []
    with open(SUPP_CSV, newline='') as f:
        return list(csv.DictReader(f))

def _save_supplies(rows):
    with open(SUPP_CSV, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=SUPP_FIELDS)
        writer.writeheader()
        writer.writerows(rows)

@expenses_bp.route('/supplies', methods=['GET'])
def list_supplies():
    return jsonify(_load_supplies())

@expenses_bp.route('/supplies', methods=['POST'])
def add_supply():
    data = request.get_json() or {}
    if not data.get('item'):
        abort(400, 'Missing item')
    row = {'item':data['item'], 'amount':data.get('amount','0')}
    rows = _load_supplies()
    rows.append(row)
    _save_supplies(rows)
    return jsonify(row), 201

@expenses_bp.route('/supplies/<item>', methods=['PUT'])
def edit_supply(item):
    data = request.get_json() or {}
    rows = _load_supplies()
    updated=False
    for r in rows:
        if r['item']==item:
            r['amount']=data.get('amount',r['amount'])
            updated=True
    if not updated:
        abort(404,'Item not found')
    _save_supplies(rows)
    return jsonify({'item':item}),200

@expenses_bp.route('/supplies/<item>', methods=['DELETE'])
def delete_supply(item):
    rows = [r for r in _load_supplies() if r['item']!=item]
    _save_supplies(rows)
    return '',204


### --- LABOR CRUD --- ###
LABOR_CSV = os.path.join(DATA_DIR,'labor_expense.csv')
LABOR_FIELDS = ['labor_role','event_type','cost']

def _load_labor():
    if not os.path.exists(LABOR_CSV):
        return []
    with open(LABOR_CSV,newline='') as f:
        return list(csv.DictReader(f))

def _save_labor(rows):
    with open(LABOR_CSV,'w',newline='') as f:
        writer = csv.DictWriter(f, fieldnames=LABOR_FIELDS)
        writer.writeheader()
        writer.writerows(rows)

@expenses_bp.route('/labor', methods=['GET'])
def list_labor():
    return jsonify(_load_labor())

@expenses_bp.route('/labor', methods=['POST'])
def add_labor():
    data = request.get_json() or {}
    for fld in LABOR_FIELDS:
        if not data.get(fld):
            abort(400, f"Missing {fld}")
    row = {
        'labor_role': data['labor_role'],
        'event_type': data['event_type'],
        'cost': data['cost']
    }
    rows = _load_labor(); rows.append(row); _save_labor(rows)
    return jsonify(row), 201

@expenses_bp.route('/labor/<role>/<event_type>', methods=['PUT'])
def edit_labor(role,event_type):
    data = request.get_json() or {}
    rows=_load_labor(); updated=False
    for r in rows:
        if r['labor_role']==role and r['event_type']==event_type:
            r['cost']=data.get('cost',r['cost'])
            updated=True
    if not updated:
        abort(404,'Entry not found')
    _save_labor(rows); return jsonify({'role':role,'event_type':event_type}),200

@expenses_bp.route('/labor/<role>/<event_type>', methods=['DELETE'])
def delete_labor(role,event_type):
    rows = [r for r in _load_labor() if not (r['labor_role']==role and r['event_type']==event_type)]
    _save_labor(rows)
    return '',204


### --- CALCULATORS --- ###

@expenses_bp.route('/calculate/food', methods=['POST'])
def calc_food():
    data = request.get_json() or {}
    headcount = int(data.get('headcount',0))
    menu      = data.get('menu',[])
    items = {r['item']:{'amount':float(r['amount']),'quantity':float(r['quantity'])}
             for r in _load_food()}
    total=0
    for item in menu:
        if item in items:
            ent=items[item]
            total += (headcount/ent['quantity'])*ent['amount']
    return jsonify({'total_food':round(total,2)})

@expenses_bp.route('/calculate/supplies', methods=['POST'])
def calc_supplies():
    data = request.get_json() or {}
    orders = data.get('orders',[])
    prices={r['item']:float(r['amount']) for r in _load_supplies()}
    total=0
    for o in orders:
        total += prices.get(o.get('item'),0)*int(o.get('count',0))
    return jsonify({'total_supplies':round(total,2)})

@expenses_bp.route('/calculate/labor', methods=['POST'])
def calc_labor():
    data = request.get_json() or {}
    assigns = data.get('assignments',[])
    labor_map={}
    for r in _load_labor():
        labor_map.setdefault(r['labor_role'],{})[r['event_type']]=float(r['cost'])
    total=0
    for a in assigns:
        total += labor_map.get(a.get('role'),{}).get(a.get('event_type'),0)*int(a.get('count',0))
    return jsonify({'total_labor':round(total,2)})
