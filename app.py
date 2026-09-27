from flask import Flask, render_template, request, redirect, session
import sqlite3
import os

app = Flask(__name__)

app.secret_key = "usta-uz-maxfiy-kalit"

# ======================================
# 🗄️ DATABASE MANZILI
# ======================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE = os.path.join(BASE_DIR, "usta.db")


# ======================================
# 🗄️ BAZANI YARATISH / TEKSHIRISH
# ======================================

def create_database():

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    # Orders jadvali
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            city TEXT NOT NULL,
            address TEXT NOT NULL,
            service TEXT NOT NULL,
            description TEXT NOT NULL,
            master TEXT,
            status TEXT DEFAULT 'new',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Mavjud ustunlarni tekshirish
    cursor.execute("PRAGMA table_info(orders)")

    columns = [
        row[1]
        for row in cursor.fetchall()
    ]

    # master yo'q bo'lsa
    if "master" not in columns:

        cursor.execute("""
            ALTER TABLE orders
            ADD COLUMN master TEXT
        """)

    # status yo'q bo'lsa
    if "status" not in columns:

        cursor.execute("""
            ALTER TABLE orders
            ADD COLUMN status TEXT DEFAULT 'new'
        """)

    conn.commit()
    conn.close()


# ======================================
# 🚀 SERVER ISHGA TUSHGANDA BAZANI YARATISH
# ======================================

create_database()


# ======================================
# 🏠 BOSH SAHIFA
# ======================================

@app.route("/")
def home():

    return render_template("index.html")


# ======================================
# 📦 BUYURTMA
# ======================================

@app.route("/order", methods=["POST"])
def order():

    # Har bir buyurtmada bazani tekshiramiz
    create_database()

    conn = None

    try:

        # Formadan ma'lumotlar
        name = request.form.get("name", "").strip()
        phone = request.form.get("phone", "").strip()
        city = request.form.get("city", "").strip()
        address = request.form.get("address", "").strip()
        service = request.form.get("service", "").strip()
        description = request.form.get("description", "").strip()
        master = request.form.get("master", "").strip()

        # Tekshirish
        if not name:
            return "❌ Ism kiritilmagan!"

        if not phone:
            return "❌ Telefon raqam kiritilmagan!"

        if not city:
            return "❌ Shahar tanlanmagan!"

        if not address:
            return "❌ Manzil kiritilmagan!"

        if not service:
            return "❌ Xizmat tanlanmagan!"

        if not description:
            return "❌ Buyurtma tavsifi kiritilmagan!"

        # Baza
        conn = sqlite3.connect(DATABASE)

        cursor = conn.cursor()

        # Buyurtmani saqlash
        cursor.execute("""
            INSERT INTO orders
            (
                name,
                phone,
                city,
                address,
                service,
                description,
                master,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            name,
            phone,
            city,
            address,
            service,
            description,
            master,
            "new"
        ))

        conn.commit()

        print("✅ YANGI BUYURTMA SAQLANDI!")

        return "✅ Buyurtmangiz muvaffaqiyatli qabul qilindi!"

    except Exception as e:

        print("======================================")
        print("❌ BUYURTMA XATOSI:", e)
        print("======================================")

        if conn:

            conn.rollback()

        return "❌ Buyurtma yuborishda server xatosi yuz berdi!"

    finally:

        if conn:

            conn.close()


# ======================================
# 👨‍💼 ADMIN PANEL
# ======================================

@app.route("/admin")
def admin():

    if not session.get("admin_logged_in"):

        return redirect("/admin-login")

    # Bazani tekshirish
    create_database()

    conn = sqlite3.connect(DATABASE)

    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()

    cursor.execute("""
        SELECT *
        FROM orders
        ORDER BY id DESC
    """)

    orders = cursor.fetchall()

    conn.close()

    return render_template(
        "admin.html",
        orders=orders
    )


# ======================================
# 🔐 ADMIN LOGIN
# ======================================

@app.route("/admin-login", methods=["GET", "POST"])
def admin_login():

    if request.method == "POST":

        username = request.form.get("username", "").strip()
        password = request.form.get("password", "").strip()

        if username == "admin" and password == "12345":

            session["admin_logged_in"] = True

            return redirect("/admin")

        return "❌ Login yoki parol noto‘g‘ri!"

    return render_template("admin_login.html")


# ======================================
# ✅ BUYURTMANI QABUL QILISH
# ======================================

@app.route(
    "/admin/order/<int:order_id>/accept",
    methods=["POST"]
)
def accept_order(order_id):

    if not session.get("admin_logged_in"):

        return redirect("/admin-login")

    create_database()

    conn = sqlite3.connect(DATABASE)

    cursor = conn.cursor()

    cursor.execute("""
        UPDATE orders
        SET status = 'accepted'
        WHERE id = ?
    """, (order_id,))

    conn.commit()

    conn.close()

    return redirect("/admin")


# ======================================
# ❌ BUYURTMANI BEKOR QILISH
# ======================================

@app.route(
    "/admin/order/<int:order_id>/cancel",
    methods=["POST"]
)
def cancel_order(order_id):

    if not session.get("admin_logged_in"):

        return redirect("/admin-login")

    create_database()

    conn = sqlite3.connect(DATABASE)

    cursor = conn.cursor()

    cursor.execute("""
        UPDATE orders
        SET status = 'cancelled'
        WHERE id = ?
    """, (order_id,))

    conn.commit()

    conn.close()

    return redirect("/admin")


# ======================================
# 🚪 ADMIN'DAN CHIQISH
# ======================================

@app.route("/admin-logout")
def admin_logout():

    session.pop(
        "admin_logged_in",
        None
    )

    return redirect("/admin-login")


# ======================================
# 🚀 LOCAL SERVER
# ======================================

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5050
    )
