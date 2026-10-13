#!/usr/bin/env bash
# UrbanDana — Full API + E2E Test Suite (curl only, no Postman)
set -u

BACKEND="http://localhost:4000"
FRONTEND="http://localhost:3000"
PASS=0
FAIL=0
declare -a FAILURES

bold="\033[1m"
green="\033[32m"
red="\033[31m"
yellow="\033[33m"
reset="\033[0m"

ok()   { echo -e "${green}✓${reset} $1"; ((PASS++)); }
fail() { echo -e "${red}✗${reset} $1"; ((FAIL++)); FAILURES+=("$1"); }
info() { echo -e "${yellow}→${reset} $1"; }
hdr()  { echo -e "\n${bold}=== $1 ===${reset}"; }

assert_status() {
  local expected="$1" actual="$2" label="$3"
  if [ "$actual" = "$expected" ]; then ok "$label (HTTP $actual)"; else fail "$label — expected $expected, got $actual"; fi
}

assert_json_field() {
  local json="$1" field="$2" expected="$3" label="$4"
  local actual=$(echo "$json" | python3 -c "import sys,json;d=json.load(sys.stdin);print(d.get('$field','__MISSING__'))" 2>/dev/null)
  if [ "$actual" = "$expected" ]; then ok "$label ($field=$actual)"; else fail "$label — $field: expected '$expected', got '$actual'"; fi
}

assert_contains() {
  local haystack="$1" needle="$2" label="$3"
  if echo "$haystack" | grep -q "$needle"; then ok "$label (contains '$needle')"; else fail "$label — does not contain '$needle'"; fi
}

hdr "TEST SETUP"
info "Backend at $BACKEND"
info "Frontend at $FRONTEND"

# === 1. HEALTH CHECKS ===
hdr "1. Health Checks"
RES=$(curl -s -w "\n%{http_code}" $BACKEND/)
CODE=$(echo "$RES" | tail -1)
BODY=$(echo "$RES" | head -1)
assert_status "200" "$CODE" "GET / (backend root)"
assert_contains "$BODY" '"health":"ok"' "GET / body has health=ok"

CODE=$(curl -s -o /dev/null -w "%{http_code}" $FRONTEND/)
assert_status "200" "$CODE" "GET / (frontend home)"

RES=$(curl -s $BACKEND/api/payments/health)
assert_json_field "$RES" "razorpay" "False" "GET /api/payments/health — razorpay=false"
assert_json_field "$RES" "mode" "COD_ONLY" "GET /api/payments/health — mode=COD_ONLY"

# === 2. PRODUCTS API ===
hdr "2. Products API"
RES=$(curl -s "$BACKEND/api/products?limit=100")
TOTAL=$(echo "$RES" | python3 -c "import sys,json;print(json.load(sys.stdin)['total'])")
if [ "$TOTAL" -ge "18" ]; then ok "GET /api/products — total=$TOTAL (≥18 expected)"; else fail "GET /api/products — total=$TOTAL, expected ≥18"; fi

RES=$(curl -s "$BACKEND/api/products?category=Bandana%20Caps")
TOTAL=$(echo "$RES" | python3 -c "import sys,json;print(json.load(sys.stdin)['total'])")
if [ "$TOTAL" -ge "1" ]; then ok "GET /api/products?category=Bandana Caps — $TOTAL caps"; else fail "Bandana Caps filter — got $TOTAL"; fi

RES=$(curl -s "$BACKEND/api/products?category=T-Shirts")
TOTAL=$(echo "$RES" | python3 -c "import sys,json;print(json.load(sys.stdin)['total'])")
if [ "$TOTAL" -ge "1" ]; then ok "GET /api/products?category=T-Shirts — $TOTAL tees"; else fail "T-Shirts filter — got $TOTAL"; fi

RES=$(curl -s "$BACKEND/api/products?featured=true")
TOTAL=$(echo "$RES" | python3 -c "import sys,json;print(json.load(sys.stdin)['total'])")
if [ "$TOTAL" -ge "1" ]; then ok "GET /api/products?featured=true — $TOTAL featured"; else fail "Featured filter — got $TOTAL"; fi

RES=$(curl -s "$BACKEND/api/products?limited=true")
TOTAL=$(echo "$RES" | python3 -c "import sys,json;print(json.load(sys.stdin)['total'])")
if [ "$TOTAL" -ge "1" ]; then ok "GET /api/products?limited=true — $TOTAL limited"; else fail "Limited filter — got $TOTAL"; fi

SLUG=$(curl -s "$BACKEND/api/products?limit=1" | python3 -c "import sys,json;print(json.load(sys.stdin)['items'][0]['slug'])")
RES=$(curl -s "$BACKEND/api/products/$SLUG")
TITLE=$(echo "$RES" | python3 -c "import sys,json;print(json.load(sys.stdin)['title'])")
if [ -n "$TITLE" ]; then ok "GET /api/products/$SLUG — title='$TITLE'"; else fail "Single product fetch"; fi
IMGS=$(echo "$RES" | python3 -c "import sys,json;print(len(json.load(sys.stdin).get('images',[])))")
if [ "$IMGS" -ge "1" ]; then ok "Product has $IMGS images"; else fail "Product has 0 images"; fi

CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND/api/products/this-slug-does-not-exist")
assert_status "404" "$CODE" "GET /api/products/nonexistent — 404"

RES=$(curl -s "$BACKEND/api/products/meta/categories")
CATS=$(echo "$RES" | python3 -c "import sys,json;d=json.load(sys.stdin);print(','.join(d))")
assert_contains "$CATS" "Bandana Caps" "Categories includes Bandana Caps"
assert_contains "$CATS" "T-Shirts" "Categories includes T-Shirts"
assert_contains "$CATS" "Limited Edition" "Categories includes Limited Edition"
assert_contains "$CATS" "Bundles" "Categories includes Bundles"

RES=$(curl -s "$BACKEND/api/products?q=red")
TOTAL=$(echo "$RES" | python3 -c "import sys,json;print(json.load(sys.stdin)['total'])")
if [ "$TOTAL" -ge "1" ]; then ok "GET /api/products?q=red — $TOTAL matches"; else fail "Search 'red' — got $TOTAL"; fi

# === 3. AUTH API ===
hdr "3. Auth API"
TEST_EMAIL="test_$(date +%s)@urbandana.test"
TEST_PW="testpass123"
RES=$(curl -s -X POST $BACKEND/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PW\",\"firstName\":\"Test\",\"lastName\":\"User\",\"phone\":\"+91 9999999999\"}")
USER_TOKEN=$(echo "$RES" | python3 -c "import sys,json;print(json.load(sys.stdin).get('token',''))" 2>/dev/null)
if [ -n "$USER_TOKEN" ]; then ok "POST /api/auth/register — token received"; else fail "Register — no token"; fi
# role is nested under user.role
USER_ROLE=$(echo "$RES" | python3 -c "import sys,json;print(json.load(sys.stdin).get('user',{}).get('role',''))")
if [ "$USER_ROLE" = "CUSTOMER" ]; then ok "Register — role=CUSTOMER"; else fail "Register — role: expected CUSTOMER, got '$USER_ROLE'"; fi

CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $BACKEND/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PW\"}")
assert_status "409" "$CODE" "Duplicate register → 409"

CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $BACKEND/api/auth/register \
  -H "Content-Type: application/json" -d '{}')
assert_status "400" "$CODE" "Register with no body → 400"

RES=$(curl -s -X POST $BACKEND/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PW\"}")
LOGIN_TOKEN=$(echo "$RES" | python3 -c "import sys,json;print(json.load(sys.stdin).get('token',''))" 2>/dev/null)
if [ -n "$LOGIN_TOKEN" ]; then ok "POST /api/auth/login — token received"; else fail "Login — no token"; fi

CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $BACKEND/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"wrong\"}")
assert_status "401" "$CODE" "Login wrong password → 401"

CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $BACKEND/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nobody@nowhere.test","password":"x"}')
assert_status "401" "$CODE" "Login unknown user → 401"

RES=$(curl -s $BACKEND/api/auth/me -H "Authorization: Bearer $USER_TOKEN")
# /me returns { user: { email, firstName, ... } }
ME_EMAIL=$(echo "$RES" | python3 -c "import sys,json;print(json.load(sys.stdin).get('user',{}).get('email',''))")
if [ "$ME_EMAIL" = "$TEST_EMAIL" ]; then ok "/api/auth/me — correct email"; else fail "/me email — expected '$TEST_EMAIL', got '$ME_EMAIL'"; fi
ME_FIRST=$(echo "$RES" | python3 -c "import sys,json;print(json.load(sys.stdin)['user']['firstName'])")
if [ "$ME_FIRST" = "Test" ]; then ok "/api/auth/me — firstName=Test"; else fail "/me firstName — got '$ME_FIRST'"; fi

CODE=$(curl -s -o /dev/null -w "%{http_code}" $BACKEND/api/auth/me)
assert_status "401" "$CODE" "/api/auth/me without token → 401"

CODE=$(curl -s -o /dev/null -w "%{http_code}" $BACKEND/api/auth/me -H "Authorization: Bearer invalidtoken")
assert_status "401" "$CODE" "/api/auth/me with invalid token → 401"

RES=$(curl -s -X POST $BACKEND/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@urbandana.in","password":"admin123"}')
ADMIN_TOKEN=$(echo "$RES" | python3 -c "import sys,json;print(json.load(sys.stdin).get('token',''))" 2>/dev/null)
if [ -n "$ADMIN_TOKEN" ]; then ok "Admin login — token received"; else fail "Admin login — no token"; fi
ADMIN_ROLE=$(echo "$RES" | python3 -c "import sys,json;print(json.load(sys.stdin).get('user',{}).get('role',''))")
if [ "$ADMIN_ROLE" = "ADMIN" ]; then ok "Admin login — role=ADMIN"; else fail "Admin — role: expected ADMIN, got '$ADMIN_ROLE'"; fi

# === 4. CART API ===
hdr "4. Cart API"
SESSION_ID="test_session_$(date +%s)"

RES=$(curl -s $BACKEND/api/cart -H "x-session-id: $SESSION_ID")
ITEMS=$(echo "$RES" | python3 -c "import sys,json;print(len(json.load(sys.stdin).get('items',[])))")
if [ "$ITEMS" = "0" ]; then ok "GET /api/cart — empty cart"; else fail "Empty cart — got $ITEMS items"; fi

PRODUCT_ID=$(curl -s "$BACKEND/api/products?limit=1" | python3 -c "import sys,json;print(json.load(sys.stdin)['items'][0]['id'])")
RES=$(curl -s -X POST $BACKEND/api/cart/items \
  -H "Content-Type: application/json" \
  -H "x-session-id: $SESSION_ID" \
  -d "{\"productId\":\"$PRODUCT_ID\",\"quantity\":2}")
ITEMS=$(echo "$RES" | python3 -c "import sys,json;print(len(json.load(sys.stdin).get('items',[])))")
if [ "$ITEMS" = "1" ]; then ok "POST /api/cart/items — cart has 1 item"; else fail "Add to cart — got $ITEMS items"; fi
QTY=$(echo "$RES" | python3 -c "import sys,json;print(json.load(sys.stdin)['items'][0]['quantity'])")
if [ "$QTY" = "2" ]; then ok "Cart item qty=2"; else fail "Cart qty — got $QTY"; fi

PRODUCT_ID2=$(curl -s "$BACKEND/api/products?limit=2" | python3 -c "import sys,json;print(json.load(sys.stdin)['items'][1]['id'])")
RES=$(curl -s -X POST $BACKEND/api/cart/items \
  -H "Content-Type: application/json" \
  -H "x-session-id: $SESSION_ID" \
  -d "{\"productId\":\"$PRODUCT_ID2\",\"quantity\":1}")
ITEMS=$(echo "$RES" | python3 -c "import sys,json;print(len(json.load(sys.stdin).get('items',[])))")
if [ "$ITEMS" = "2" ]; then ok "POST /api/cart/items (second) — cart has 2 items"; else fail "Second add — got $ITEMS"; fi

ITEM_ID=$(curl -s $BACKEND/api/cart -H "x-session-id: $SESSION_ID" | python3 -c "import sys,json;print(json.load(sys.stdin)['items'][0]['id'])")
RES=$(curl -s -X PATCH "$BACKEND/api/cart/items/$ITEM_ID" \
  -H "Content-Type: application/json" \
  -H "x-session-id: $SESSION_ID" \
  -d '{"quantity":5}')
QTY=$(echo "$RES" | python3 -c "import sys,json;print(json.load(sys.stdin).get('quantity'))")
if [ "$QTY" = "5" ]; then ok "PATCH /api/cart/items/:id — qty=5"; else fail "Update qty — got $QTY"; fi

RES=$(curl -s -X PATCH "$BACKEND/api/cart/items/$ITEM_ID" \
  -H "Content-Type: application/json" \
  -H "x-session-id: $SESSION_ID" \
  -d '{"quantity":0}')
QTY=$(echo "$RES" | python3 -c "import sys,json;print(json.load(sys.stdin).get('quantity'))")
if [ "$QTY" = "1" ]; then ok "PATCH qty=0 → clamped to 1"; else fail "Clamp qty — got $QTY"; fi

RES=$(curl -s -X DELETE "$BACKEND/api/cart/items/$ITEM_ID" -H "x-session-id: $SESSION_ID")
assert_json_field "$RES" "ok" "True" "DELETE /api/cart/items/:id"
ITEMS=$(curl -s $BACKEND/api/cart -H "x-session-id: $SESSION_ID" | python3 -c "import sys,json;print(len(json.load(sys.stdin).get('items',[])))")
if [ "$ITEMS" = "1" ]; then ok "After delete — cart has 1 item"; else fail "After delete — got $ITEMS"; fi

RES=$(curl -s -X DELETE $BACKEND/api/cart -H "x-session-id: $SESSION_ID")
assert_json_field "$RES" "ok" "True" "DELETE /api/cart (clear)"
ITEMS=$(curl -s $BACKEND/api/cart -H "x-session-id: $SESSION_ID" | python3 -c "import sys,json;print(len(json.load(sys.stdin).get('items',[])))")
if [ "$ITEMS" = "0" ]; then ok "Cart cleared"; else fail "Clear cart — got $ITEMS"; fi

# === 5. ORDERS API ===
hdr "5. Orders API"
RES=$(curl -s -X POST $BACKEND/api/orders \
  -H "Content-Type: application/json" \
  -d "{
    \"email\":\"$TEST_EMAIL\",
    \"phone\":\"+91 9999999999\",
    \"firstName\":\"Test\",\"lastName\":\"User\",
    \"address\":\"123 Test St\",\"city\":\"Mumbai\",\"state\":\"MH\",\"pincode\":\"400001\",
    \"items\":[{\"productId\":\"$PRODUCT_ID\",\"quantity\":1}],
    \"paymentMethod\":\"COD\"
  }")
ORDER_NUM=$(echo "$RES" | python3 -c "import sys,json;print(json.load(sys.stdin).get('orderNumber',''))" 2>/dev/null)
ORDER_ID=$(echo "$RES" | python3 -c "import sys,json;print(json.load(sys.stdin).get('id',''))" 2>/dev/null)
if [ -n "$ORDER_NUM" ]; then ok "POST /api/orders — orderNumber=$ORDER_NUM"; else fail "Create order — no orderNumber"; fi
assert_json_field "$RES" "status" "PENDING" "New order — status=PENDING"
assert_json_field "$RES" "paymentMethod" "COD" "New order — paymentMethod=COD"

CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $BACKEND/api/orders \
  -H "Content-Type: application/json" \
  -d '{"email":"a@b.c","phone":"x","firstName":"A","lastName":"B","address":"x","city":"x","state":"x","pincode":"x","items":[]}')
assert_status "400" "$CODE" "POST /api/orders with empty items → 400"

RES=$(curl -s "$BACKEND/api/orders/$ORDER_NUM")
assert_json_field "$RES" "orderNumber" "$ORDER_NUM" "GET /api/orders/:orderNumber"

CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND/api/orders/UD-FAKE-12345")
assert_status "404" "$CODE" "GET /api/orders/unknown → 404"

RES=$(curl -s $BACKEND/api/orders -H "Authorization: Bearer $ADMIN_TOKEN")
COUNT=$(echo "$RES" | python3 -c "import sys,json;print(len(json.load(sys.stdin)))" 2>/dev/null)
if [ "$COUNT" -ge "1" ]; then ok "GET /api/orders (admin) — $COUNT orders visible"; else fail "Admin orders list — got $COUNT"; fi

RES=$(curl -s $BACKEND/api/orders -H "Authorization: Bearer $USER_TOKEN")
COUNT=$(echo "$RES" | python3 -c "import sys,json;print(len(json.load(sys.stdin)))" 2>/dev/null)
if [ "$COUNT" -ge "1" ]; then ok "GET /api/orders (customer) — $COUNT orders visible"; else fail "Customer orders list — got $COUNT"; fi

CODE=$(curl -s -o /dev/null -w "%{http_code}" $BACKEND/api/orders)
assert_status "401" "$CODE" "GET /api/orders without auth → 401"

# === 6. PAYMENTS API ===
hdr "6. Payments API (Razorpay)"
RES=$(curl -s $BACKEND/api/payments/health)
assert_json_field "$RES" "razorpay" "False" "Payments health — razorpay=false"
assert_json_field "$RES" "mode" "COD_ONLY" "Payments health — mode=COD_ONLY"

RES=$(curl -s -X POST $BACKEND/api/payments/create-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{"amount":149900,"orderId":"'"$ORDER_ID"'"}')
assert_contains "$RES" "Razorpay not configured" "Create-order without keys → 503 message"

CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $BACKEND/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount":149900}')
assert_status "401" "$CODE" "Create-order without auth → 401"

CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $BACKEND/api/payments/create-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{"amount":50}')
assert_status "400" "$CODE" "Create-order amount < 100 → 400"

RES=$(curl -s -X POST $BACKEND/api/payments/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{"razorpay_order_id":"fake","razorpay_payment_id":"fake","razorpay_signature":"fake","orderId":"'"$ORDER_ID"'"}')
assert_contains "$RES" "Razorpay not configured" "Verify without keys → 503 message"

# === 7. CMS API ===
hdr "7. CMS API"
RES=$(curl -s $BACKEND/api/cms/founder)
assert_json_field "$RES" "name" "Vikram Kumar" "GET /api/cms/founder — name=Vikram Kumar"
assert_contains "$RES" "Dehradun" "Founder story mentions Dehradun"

RES=$(curl -s $BACKEND/api/cms/brand)
assert_json_field "$RES" "name" "URBANDANA" "GET /api/cms/brand — name=URBANDANA"
assert_json_field "$RES" "tagline" "Style That Never Stops" "Brand tagline"

# === 8. IMAGE SERVING ===
hdr "8. Image Serving"
IMG_URL=$(curl -s "$BACKEND/api/products?limit=1" | python3 -c "import sys,json;print(json.load(sys.stdin)['items'][0]['images'][0]['url'])")
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND$IMG_URL")
assert_status "200" "$CODE" "GET image $IMG_URL"

for i in 1 2 3; do
  IMG_URL=$(curl -s "$BACKEND/api/products?limit=20" | python3 -c "
import sys,json,random
d=json.load(sys.stdin)
p=random.choice(d['items'])
img=random.choice(p['images'])
print(img['url'])
")
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND$IMG_URL")
  assert_status "200" "$CODE" "Random image $IMG_URL"
done

# === 9. FRONTEND ROUTES ===
hdr "9. Frontend Routes"
for path in "/" "/shop" "/about" "/cart" "/checkout" "/login" "/signup" "/account" "/wishlist" "/product/$SLUG"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND$path")
  assert_status "200" "$CODE" "GET $FRONTEND$path"
done

CODE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND/this-page-does-not-exist")
assert_status "404" "$CODE" "GET unknown page → 404"

# === 10. FRONTEND ↔ BACKEND PROXY ===
hdr "10. Frontend ↔ Backend Proxy"
RES=$(curl -s "$FRONTEND/api/products?limit=2")
TOTAL=$(echo "$RES" | python3 -c "import sys,json;print(json.load(sys.stdin)['total'])")
if [ "$TOTAL" -ge "18" ]; then ok "FE proxy /api/products — total=$TOTAL"; else fail "FE proxy — got $TOTAL"; fi

IMG_URL=$(curl -s "$BACKEND/api/products?limit=1" | python3 -c "import sys,json;print(json.load(sys.stdin)['items'][0]['images'][0]['url'])")
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND$IMG_URL")
assert_status "200" "$CODE" "FE proxy image"

RES=$(curl -s "$FRONTEND/api/cms/founder")
assert_json_field "$RES" "name" "Vikram Kumar" "FE proxy /api/cms/founder"

RES=$(curl -s "$FRONTEND/api/payments/health")
assert_json_field "$RES" "mode" "COD_ONLY" "FE proxy /api/payments/health"

# === 11. E2E ===
hdr "11. E2E: Full Customer Journey"
RES=$(curl -s -X POST $BACKEND/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PW\"}")
E2E_TOKEN=$(echo "$RES" | python3 -c "import sys,json;print(json.load(sys.stdin).get('token',''))")
ok "Step 1: Login as $TEST_EMAIL"

E2E_SESSION="e2e_$(date +%s)"
curl -s -X POST $BACKEND/api/cart/items \
  -H "Content-Type: application/json" -H "x-session-id: $E2E_SESSION" \
  -d "{\"productId\":\"$PRODUCT_ID\",\"quantity\":1}" > /dev/null
curl -s -X POST $BACKEND/api/cart/items \
  -H "Content-Type: application/json" -H "x-session-id: $E2E_SESSION" \
  -d "{\"productId\":\"$PRODUCT_ID2\",\"quantity\":2}" > /dev/null
CART_COUNT=$(curl -s $BACKEND/api/cart -H "x-session-id: $E2E_SESSION" | python3 -c "import sys,json;print(len(json.load(sys.stdin)['items']))")
if [ "$CART_COUNT" = "2" ]; then ok "Step 2: Cart has 2 items"; else fail "Step 2: Cart has $CART_COUNT items"; fi

RES=$(curl -s -X POST $BACKEND/api/orders \
  -H "Content-Type: application/json" \
  -d "{
    \"email\":\"$TEST_EMAIL\",\"phone\":\"+91 9999999999\",
    \"firstName\":\"Test\",\"lastName\":\"User\",
    \"address\":\"123 Test St\",\"city\":\"Mumbai\",\"state\":\"MH\",\"pincode\":\"400001\",
    \"items\":[
      {\"productId\":\"$PRODUCT_ID\",\"quantity\":1},
      {\"productId\":\"$PRODUCT_ID2\",\"quantity\":2}
    ],
    \"paymentMethod\":\"COD\"
  }")
E2E_ORDER=$(echo "$RES" | python3 -c "import sys,json;print(json.load(sys.stdin).get('orderNumber',''))")
if [ -n "$E2E_ORDER" ]; then ok "Step 3: Order placed — $E2E_ORDER"; else fail "Step 3: Order placement"; fi
TOTAL_AMT=$(echo "$RES" | python3 -c "import sys,json;print(json.load(sys.stdin).get('totalAmount'))")
ok "Step 4: Order total = ₹$(python3 -c "print($TOTAL_AMT/100)")"

RES=$(curl -s $BACKEND/api/orders -H "Authorization: Bearer $E2E_TOKEN")
FOUND=$(echo "$RES" | python3 -c "
import sys,json
d=json.load(sys.stdin)
nums=[o['orderNumber'] for o in d]
print('yes' if '$E2E_ORDER' in nums else 'no')
")
if [ "$FOUND" = "yes" ]; then ok "Step 5: Order visible in customer's order list"; else fail "Step 5: Order not in customer list"; fi

RES=$(curl -s "$BACKEND/api/orders/$E2E_ORDER")
ITEMS_COUNT=$(echo "$RES" | python3 -c "import sys,json;print(len(json.load(sys.stdin).get('items',[])))")
if [ "$ITEMS_COUNT" = "2" ]; then ok "Step 6: Order has 2 line items"; else fail "Step 6: Order has $ITEMS_COUNT items"; fi

# === SUMMARY ===
hdr "TEST SUMMARY"
echo ""
echo -e "${green}Passed:${reset} ${bold}$PASS${reset}"
echo -e "${red}Failed:${reset} ${bold}$FAIL${reset}"
echo ""
if [ "$FAIL" -gt "0" ]; then
  echo -e "${red}Failures:${reset}"
  for f in "${FAILURES[@]}"; do
    echo -e "  ${red}✗${reset} $f"
  done
  exit 1
else
  echo -e "${green}${bold}ALL TESTS PASSED ✅${reset}"
  exit 0
fi
