const { chromium } = require('playwright');
const axios = require('axios');
const fs = require('fs');
const readline = require('readline-sync');

function generateEmail() {
    const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    const name = Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return { login: name, domain: '1secmail.com', email: `${name}@1secmail.com` };
}

async function getOTP(login, domain) {
    let tries = 0;
    while (tries < 20) {
        const res = await axios.get(`https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`);
        if (res.data.length > 0) {
            const mailId = res.data[0].id;
            const mail = await axios.get(`https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${mailId}`);
            const otpMatch = mail.data.body.match(/(\d{4,6})/); // cari 4–6 digit angka
            if (otpMatch) return otpMatch[1];
        }
        await new Promise(r => setTimeout(r, 3000));
        tries++;
    }
    throw new Error("OTP tidak ditemukan dalam 1 menit.");
}

async function daftarAkun(referralCode, index) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const { login, domain, email } = generateEmail();

    console.log(`\n[Membuat akun ke-${index}]`);
    console.log(`Menggunakan email: ${email}`);

    try {
        await page.goto('https://dtec.space/airdrops/', { waitUntil: 'networkidle' });

        // Isi email
        await page.fill('input[type="email"]', email);

        // Submit email
        await page.click('button[type="submit"]');

        // Tunggu input OTP muncul
        await page.waitForSelector('input[placeholder*="OTP"]', { timeout: 15000 });

        console.log("Menunggu OTP...");
        const otp = await getOTP(login, domain);
        console.log("OTP diterima:", otp);

        // Isi OTP
        await page.fill('input[placeholder*="OTP"]', otp);
        await page.click('button[type="submit"]');

        // Tunggu form referral
        await page.waitForSelector('input[placeholder*="referral"]', { timeout: 15000 });

        // Isi referral dan submit
        await page.fill('input[placeholder*="referral"]', referralCode);
        await page.click('button[type="submit"]');

        await page.waitForTimeout(3000);

        console.log("✅ Akun berhasil dibuat.");
        fs.appendFileSync('akun.txt', `${email}|${otp}\n`);

    } catch (err) {
        console.error("❌ Gagal:", err.message);
    } finally {
        await browser.close();
    }
}

(async () => {
    console.log("\n=== BOT AUTO DTEC ===");
    const referral = readline.question("Masukkan referral code: ");
    const jumlah = parseInt(readline.question("Berapa akun ingin dibuat? "), 10);

    for (let i = 1; i <= jumlah; i++) {
        await daftarAkun(referral, i);
    }

    console.log("\nSelesai. Hasil disimpan di akun.txt\n");
})();
