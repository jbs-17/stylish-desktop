export default function tanggalString() {
    const tanggal = new Date();
    const tahun = tanggal.getFullYear();
    const bulan = String(tanggal.getMonth() + 1).padStart(2, '0');
    const hari = String(tanggal.getDate()).padStart(2, '0');
    const jam = String(tanggal.getHours()).padStart(2, '0');
    const menit = String(tanggal.getMinutes()).padStart(2, '0');
    const detik = String(tanggal.getSeconds()).padStart(2, '0');
    const tanggalString = `${hari}-${bulan}-${tahun}_${jam}-${menit}-${detik}`;
    return tanggalString
}
export {tanggalString}