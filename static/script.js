// ======================================
// USTA.UZ
// USTA QIDIRISH + FILTR + PROFIL + BUYURTMA
// ======================================


// ======================================
// USTALAR MA'LUMOTLARI
// ======================================

const masters = [

    {
        id: 1,
        name: "Anvar Karimov",
        service: "Elektrik",
        city: "Toshkent",
        rating: 4.9,
        jobs: 127,
        experience: "8 yil",
        phone: "+998 90 123 45 67",
        icon: "⚡",
        description:
            "Uy va ofislar uchun elektr montaj, rozetka, yoritish va elektr ta'mirlash xizmatlari."
    },

    {
        id: 2,
        name: "Sardor Aliyev",
        service: "Santexnik",
        city: "Toshkent",
        rating: 4.8,
        jobs: 94,
        experience: "6 yil",
        phone: "+998 91 234 56 78",
        icon: "🚰",
        description:
            "Suv quvurlari, kran, unitaz, rakovina va boshqa santexnika xizmatlari."
    },

    {
        id: 3,
        name: "Bekzod Rustamov",
        service: "Quruvchi",
        city: "Samarqand",
        rating: 4.9,
        jobs: 156,
        experience: "10 yil",
        phone: "+998 93 345 67 89",
        icon: "🔨",
        description:
            "Uy qurish, ta'mirlash, gipsokarton va qurilish ishlari."
    },

    {
        id: 4,
        name: "Jasur Tursunov",
        service: "Malyar",
        city: "Farg‘ona",
        rating: 4.7,
        jobs: 82,
        experience: "5 yil",
        phone: "+998 94 456 78 90",
        icon: "🎨",
        description:
            "Devorlarni bo‘yash, shpaklyovka, dekor va ichki bezak ishlari."
    },

    {
        id: 5,
        name: "Dilshod Sobirov",
        service: "Duradgor",
        city: "Andijon",
        rating: 4.8,
        jobs: 73,
        experience: "7 yil",
        phone: "+998 95 567 89 01",
        icon: "🪚",
        description:
            "Mebel, eshik, shkaf va yog‘ochdan tayyorlangan buyumlar."
    },

    {
        id: 6,
        name: "Muhammadali Hasanov",
        service: "Konditsioner",
        city: "Namangan",
        rating: 4.9,
        jobs: 119,
        experience: "9 yil",
        phone: "+998 97 678 90 12",
        icon: "❄️",
        description:
            "Konditsioner o‘rnatish, tozalash, diagnostika va ta'mirlash."
    }

];


// ======================================
// USTALARNI EKRANGA CHIQARISH
// ======================================

function showMasters(list = masters) {

    const grid = document.getElementById("masterGrid");
    const noResults = document.getElementById("noResults");

    if (!grid) {
        console.error("masterGrid topilmadi!");
        return;
    }

    grid.innerHTML = "";

    if (list.length === 0) {

        if (noResults) {
            noResults.style.display = "block";
        }

        return;
    }

    if (noResults) {
        noResults.style.display = "none";
    }

    list.forEach(master => {

        const card = document.createElement("div");

        card.className = "master-card";

        card.innerHTML = `

            <div class="master-avatar">
                ${master.icon}
            </div>

            <h3>
                ${master.name}
            </h3>

            <p class="master-info">
                🔧 ${master.service}
            </p>

            <p class="master-info">
                📍 ${master.city}
            </p>

            <div class="master-rating">
                ⭐ ${master.rating}
            </div>

            <p class="master-info">
                👨‍🔧 ${master.experience} tajriba
            </p>

            <div class="master-buttons">

                <button
                    type="button"
                    class="profile-btn"
                    onclick="openProfile(${master.id})"
                >
                    👤 Profil
                </button>

                <button
                    type="button"
                    class="order-btn"
                    onclick="orderMaster('${master.name}')"
                >
                    📋 Buyurtma
                </button>

            </div>

        `;

        grid.appendChild(card);

    });

}


// ======================================
// FILTRLASH
// ======================================

function filterMasters() {

    const searchInput =
        document.getElementById("masterSearch");

    const serviceInput =
        document.getElementById("serviceFilter");

    const cityInput =
        document.getElementById("cityFilter");


    const search = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const service = serviceInput
        ? serviceInput.value
        : "";

    const city = cityInput
        ? cityInput.value
        : "";


    const filtered = masters.filter(master => {

        const searchMatch =
            master.name.toLowerCase().includes(search) ||
            master.service.toLowerCase().includes(search);

        const serviceMatch =
            service === "" ||
            master.service === service;

        const cityMatch =
            city === "" ||
            master.city === city;

        return searchMatch && serviceMatch && cityMatch;

    });


    showMasters(filtered);

}


// ======================================
// PROFIL OCHISH
// ======================================

function openProfile(id) {

    const master = masters.find(
        item => item.id === id
    );

    if (!master) {
        return;
    }


    const modal =
        document.getElementById("profileModal");

    const content =
        document.getElementById("profileContent");


    if (!modal || !content) {
        console.error("Profil oynasi topilmadi!");
        return;
    }


    content.innerHTML = `

        <div class="profile-header">

            <div class="profile-avatar">
                ${master.icon}
            </div>

            <h2>
                ${master.name}
            </h2>

            <p class="profile-profession">
                ${master.service}
            </p>

            <div class="profile-rating">
                ⭐ ${master.rating} / 5
            </div>

        </div>


        <div class="profile-details">

            <p>
                📍 <strong>Shahar:</strong>
                ${master.city}
            </p>

            <p>
                👨‍🔧 <strong>Tajriba:</strong>
                ${master.experience}
            </p>

            <p>
                📋 <strong>Bajarilgan ishlar:</strong>
                ${master.jobs} ta
            </p>

            <p>
                📞 <strong>Telefon:</strong>
                ${master.phone}
            </p>

            <p>
                📝 <strong>Ma'lumot:</strong>
                ${master.description}
            </p>

        </div>


        <button
            type="button"
            class="profile-order"
            onclick="orderMaster('${master.name}')"
        >
            📋 ${master.name}ga buyurtma berish
        </button>

    `;


    modal.style.display = "flex";

}


// ======================================
// PROFILNI YOPISH
// ======================================

function closeProfile() {

    const modal =
        document.getElementById("profileModal");

    if (modal) {
        modal.style.display = "none";
    }

}


// ======================================
// BUYURTMA MODALINI OCHISH
// ======================================

function orderMaster(masterName) {

    console.log("Buyurtma bosildi:", masterName);


    const master = masters.find(
        item => item.name === masterName
    );


    const orderModal =
        document.getElementById("orderModal");

    const masterInput =
        document.getElementById("orderMaster");

    const serviceInput =
        document.getElementById("orderService");


    // Buyurtma oynasi mavjudligini tekshirish
    if (!orderModal) {

        console.error("orderModal topilmadi!");

        alert("❌ Buyurtma oynasi topilmadi!");

        return;
    }


    // Tanlangan ustani yozish
    if (masterInput) {

        masterInput.value = masterName;

    }


    // Ustaning xizmatini avtomatik tanlash
    if (master && serviceInput) {

        serviceInput.value = master.service;

    }


    // Buyurtma oynasini ochish
    orderModal.style.display = "flex";

}


// ======================================
// BUYURTMA MODALINI YOPISH
// ======================================

function closeOrder() {

    const orderModal =
        document.getElementById("orderModal");


    if (orderModal) {

        orderModal.style.display = "none";

    }

}


// ======================================
// MODAL TASHQARISINI BOSGANDA YOPISH
// ======================================

window.addEventListener("click", function(event) {

    const profileModal =
        document.getElementById("profileModal");

    const orderModal =
        document.getElementById("orderModal");


    if (
        profileModal &&
        event.target === profileModal
    ) {

        closeProfile();

    }


    if (
        orderModal &&
        event.target === orderModal
    ) {

        closeOrder();

    }

});


// ======================================
// BUYURTMANI SERVERGA YUBORISH
// ======================================

function submitOrder(event) {

    event.preventDefault();


    const nameElement =
        document.getElementById("customerName");

    const phoneElement =
        document.getElementById("customerPhone");

    const cityElement =
        document.getElementById("orderCity");

    const addressElement =
        document.getElementById("orderAddress");

    const serviceElement =
        document.getElementById("orderService");

    const descriptionElement =
        document.getElementById("orderDescription");

    const masterElement =
        document.getElementById("orderMaster");


    // Elementlar mavjudligini tekshirish
    if (
        !nameElement ||
        !phoneElement ||
        !cityElement ||
        !addressElement ||
        !serviceElement ||
        !descriptionElement ||
        !masterElement
    ) {

        console.error("Buyurtma formasidagi element topilmadi!");

        alert(
            "❌ Buyurtma formasida xatolik bor!"
        );

        return;

    }


    const name =
        nameElement.value.trim();

    const phone =
        phoneElement.value.trim();

    const city =
        cityElement.value;

    const address =
        addressElement.value.trim();

    const service =
        serviceElement.value;

    const description =
        descriptionElement.value.trim();

    const master =
        masterElement.value;


    // Majburiy maydonlarni tekshirish
    if (
        !name ||
        !phone ||
        !city ||
        !address ||
        !service ||
        !description
    ) {

        alert(
            "⚠️ Iltimos, barcha maydonlarni to‘ldiring!"
        );

        return;

    }


    // FormData yaratish
    const formData =
        new FormData();


    formData.append(
        "name",
        name
    );

    formData.append(
        "phone",
        phone
    );

    formData.append(
        "city",
        city
    );

    formData.append(
        "address",
        address
    );

    formData.append(
        "service",
        service
    );

    formData.append(
        "description",
        description
    );

    formData.append(
        "master",
        master
    );


    // Flask serverga yuborish
    fetch("/order", {

        method: "POST",

        body: formData

    })

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "Server xatosi: " + response.status
            );

        }

        return response.text();

    })

    .then(data => {

        alert(data);


        const form =
            document.getElementById("orderForm");


        if (form) {

            form.reset();

        }


        closeOrder();

    })

    .catch(error => {

        console.error(
            "Buyurtma xatosi:",
            error
        );


        alert(
            "❌ Buyurtma yuborishda xatolik yuz berdi!"
        );

    });

}


// ======================================
// LOGIN
// ======================================

function login() {

    alert(
        "👤 Ro‘yxatdan o‘tish va kirish tizimi tez orada qo‘shiladi."
    );

}


// ======================================
// SAHIFA OCHILGANDA USTALARNI CHIQARISH
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "✅ Usta.Uz ishga tushdi!"
        );

        showMasters();

    }
);