class Waktu {
    get date() {
        return new Date();
    }

    duaDigit(angka) {
        angka = Number(angka);
        return angka < 10 ? `0${angka}` : `${angka}`;
    }

    waktu() {
        return String(this.date);
    }

    tahun() {
        return String(this.date.getFullYear());
    }

    tanggal() {
        return this.duaDigit(this.date.getDate());
    }

    bulan() {
        return this.duaDigit(this.date.getMonth() + 1);
    }

    hari() {
        return this.date.getDay();
    }

    jam() {
        return this.duaDigit(this.date.getHours());
    }

    menit() {
        return this.duaDigit(this.date.getMinutes());
    }

    detik() {
        return this.duaDigit(this.date.getSeconds());
    }

    namaHari() {
        const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        return hari[this.hari()];
    }

    namaBulan() {
        const bulan = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        return bulan[this.date.getMonth()];
    }

    sekarang() {
        return `${this.namaHari()} ${this.tanggal()} ${this.namaBulan()} ${this.tahun()} ${this.jam()}:${this.menit()}:${this.detik()}`;
    }

    isoString() {
        return this.date.toISOString();
    }

    timestamp() {
        return this.date.getTime();
    }

    tanggalLengkap() {
        return `${this.tahun()}-${this.bulan()}-${this.tanggal()}-${this.jam()}-${this.menit()}-${this.detik()}`;
    }

    tanggalPendek() {
        return `${this.tanggal()}/${this.bulan()}/${this.tahun()}`;
    }

    jamLengkap() {
        return `${this.jam()}:${this.menit()}:${this.detik()}`;
    }
}

export default Waktu;