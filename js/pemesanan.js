const waLink = t => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t)}`;
const go = u => { const w = window.open(u, '_blank'); if (!w) location.href = u; };
const tgl = v => new Date(v + 'T00:00').toLocaleDateString('id-ID', { dateStyle: 'long' });
const must = (el, msg) => { alert(msg); el && el.focus(); return false; };
const addr = f => { const v = n => f.elements[n].value.trim(); return `${v('jalan')}, RT/RW ${v('rtrw')}, Desa/Kel. ${v('desa')}, Kec. ${v('kec')}, ${v('kota')}, ${v('prov')} ${v('pos')}`; };

// Dropdown paket prasmanan: listener dipasang langsung (bukan di DOMContentLoaded)
// supaya tidak ketinggalan sinyal, dan data yang sudah ada langsung dipakai.
const sel = document.getElementById('paket');
const fill = ms => {
  if (!sel) return;
  const cur = sel.value;
  sel.innerHTML = ms.length ? '<option value="">Pilih paket…</option>' + ms.map(m => `<option>${esc(m.name)}</option>`).join('')
    : '<option value="">Paket belum tersedia, hubungi kami via WhatsApp</option>';
  if (cur) sel.value = cur;
};
document.addEventListener('katalog:ready', e => fill(e.detail));
if (window.__menus) fill(window.__menus);

document.addEventListener('DOMContentLoaded', () => {
  const p = document.body.dataset.page, today = new Date().toISOString().slice(0, 10);
  document.querySelectorAll('input[type=date]').forEach(i => i.min = today);

  if (p === 'nasi') {
    const cat = $('#katalog'), form = $('#detail');
    cat.addEventListener('input', e => {
      if (!e.target.classList.contains('qty-in')) return;
      const c = e.target.closest('.card'), q = Math.max(0, parseInt(e.target.value) || 0);
      $('.sub-total', c).textContent = rp(q * Number(c.dataset.price));
    });
    cat.addEventListener('click', e => {
      const btn = e.target.closest('.btn-order'); if (!btn) return;
      const c = btn.closest('.card'), q = parseInt($('.qty-in', c).value) || 0;
      if (q < 1) return must($('.qty-in', c), 'Isi jumlah box terlebih dahulu.');
      if (!form.reportValidity()) return;
      const f = form.elements;
      go(waLink(`Assalamu'alaikum, saya ingin bertanya mengenai pemesanan katering. Nama pemesan: ${f.nama.value.trim()}, Jenis layanan: Nasi Box, Paket: ${c.dataset.name}, Jumlah: ${q} box, Tanggal: ${tgl(f.tanggal.value)}, Lokasi: ${addr(form)}. Mohon informasi ketersediaan dan konfirmasi harga akhir. Terima kasih.`));
    });
  }

  if (p === 'prasmanan') {
    $('#katalog').addEventListener('click', e => {
      const a = e.target.closest('.pilih'); if (a) sel.value = a.dataset.name;
    });
    $('#form-acara').addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target, v = n => f.elements[n].value.trim();
      const alat = [...f.querySelectorAll('input[name=alat]:checked')].map(x => x.value);
      go(waLink(`Assalamu'alaikum, saya ingin bertanya mengenai pemesanan katering. Nama pemesan: ${v('nama')}, Jenis layanan: Prasmanan, Jenis acara: ${v('acara')}, Paket: ${v('paket')}, Pelayanan: ${v('pelayanan')}, Tanggal: ${tgl(v('tanggal'))}, Lokasi: ${addr(f)}, Jumlah undangan: ${v('undangan')} orang, Perkiraan tamu hadir: ${v('hadir')} orang, Peralatan tambahan: ${alat.length ? alat.join(', ') : '-'}, Permintaan khusus: ${v('khusus') || '-'}. Mohon informasi ketersediaan dan konfirmasi harga akhir. Terima kasih.`));
    });
  }
});
