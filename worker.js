export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Jika request mengarah ke /api/hitung, jalankan fungsi FaaS
    if (url.pathname === "/api/hitung") {
      const target = parseFloat(url.searchParams.get("target"));
      const setoran = parseFloat(url.searchParams.get("setoran"));
      const saldoAwal = parseFloat(url.searchParams.get("awal")) || 0;

      if (isNaN(target) || isNaN(setoran) || target <= 0 || setoran <= 0) {
        return Response.json(
          { status: "error", pesan: "Parameter target dan setoran harus lebih dari 0." },
          { status: 400 }
        );
      }

      const sisaKebutuhan = Math.max(0, target - saldoAwal);
      const estimasiBulan = Math.ceil(sisaKebutuhan / setoran);
      const estimasiTahun = (estimasiBulan / 12).toFixed(1);

      return Response.json({
        status: "sukses",
        lokasi_eksekusi_edge: request.cf?.colo || "Cloudflare Edge",
        hasil_perhitungan: {
          sisa_dana_dibutuhkan: sisaKebutuhan,
          estimasi_waktu_bulan: estimasiBulan,
          keterangan:
            sisaKebutuhan === 0
              ? "Target tabungan sudah tercapai!"
              : `Target tercapai dalam ${estimasiBulan} bulan (±${estimasiTahun} tahun).`,
        },
      });
    }

    // Selain /api/hitung, tampilkan halaman web statis (index.html)
    return env.ASSETS.fetch(request);
  },
};