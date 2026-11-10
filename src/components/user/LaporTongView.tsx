import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ReportIssueType, ReporterRole } from '../../types';
import {
  Trash2,
  AlertTriangle,
  FileQuestion,
  Camera,
  MapPin,
  CheckCircle,
  MessageSquare,
  Upload,
  ArrowRight,
  Wind,
  Wrench,
  Shuffle,
  AlertOctagon,
  HelpCircle,
  X,
  FileText
} from 'lucide-react';
import { validateReportSubmission } from '../../utils/reportUtils';

type IssueCategory = 'fisik' | 'kebersihan' | 'sistem';

interface IssueOption {
  type: ReportIssueType;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  badgeBg: string;
  category: IssueCategory;
}

const ISSUE_OPTIONS: IssueOption[] = [
  {
    type: 'Penuh',
    label: 'Tong Penuh',
    desc: 'Sampah sudah meluap ke luar tong',
    icon: Trash2,
    colorClass: 'border-red-500 bg-red-50 text-red-600 ring-red-500/20',
    badgeBg: 'bg-red-500 text-white',
    category: 'fisik'
  },
  {
    type: 'Rusak',
    label: 'Tong Rusak / Pecah',
    desc: 'Engsel patah, bodi retak, atau roda copot',
    icon: AlertTriangle,
    colorClass: 'border-orange-500 bg-orange-50 text-orange-600 ring-orange-500/20',
    badgeBg: 'bg-orange-500 text-white',
    category: 'fisik'
  },
  {
    type: 'Tutup macet',
    label: 'Tutup / Pedal Macet',
    desc: 'Pedal injak macet / tutup tidak mau terbuka',
    icon: Wrench,
    colorClass: 'border-purple-500 bg-purple-50 text-purple-600 ring-purple-500/20',
    badgeBg: 'bg-purple-600 text-white',
    category: 'fisik'
  },
  {
    type: 'Sampah berserakan',
    label: 'Sampah Berserakan',
    desc: 'Banyak sampah berceceran di lantai sekitar tong',
    icon: AlertOctagon,
    colorClass: 'border-rose-500 bg-rose-50 text-rose-600 ring-rose-500/20',
    badgeBg: 'bg-rose-600 text-white',
    category: 'kebersihan'
  },
  {
    type: 'Bau tidak sedap',
    label: 'Bau Tidak Sedap',
    desc: 'Bau menyengat atau ada lalat/belatung',
    icon: Wind,
    colorClass: 'border-amber-500 bg-amber-50 text-amber-600 ring-amber-500/20',
    badgeBg: 'bg-amber-600 text-white',
    category: 'kebersihan'
  },
  {
    type: 'Salah pilah',
    label: 'Salah Pilah / Tercampur',
    desc: 'Sampah tidak sesuai kategori stiker tong',
    icon: Shuffle,
    colorClass: 'border-indigo-500 bg-indigo-50 text-indigo-600 ring-indigo-500/20',
    badgeBg: 'bg-indigo-600 text-white',
    category: 'sistem'
  },
  {
    type: 'Label salah',
    label: 'Label / QR Rusak',
    desc: 'Stiker robek, kotor, atau QR tidak terbaca',
    icon: FileQuestion,
    colorClass: 'border-blue-500 bg-blue-50 text-blue-600 ring-blue-500/20',
    badgeBg: 'bg-blue-600 text-white',
    category: 'sistem'
  },
  {
    type: 'Lainnya',
    label: 'Masalah Lainnya',
    desc: 'Jelaskan kendala spesifik pada kolom teks',
    icon: HelpCircle,
    colorClass: 'border-slate-500 bg-slate-50 text-slate-700 ring-slate-500/20',
    badgeBg: 'bg-slate-700 text-white',
    category: 'sistem'
  }
];

const QUICK_TEXT_CHIPS = [
  'Sampah meluap ke lantai koridor',
  'Bau menyengat dekat area kantin',
  'Pedal injak patah, tutup miring',
  'Banyak gelas anorganik masuk ke tong organik',
  'Stiker QR robek tidak terbaca scanner'
];

export const LaporTongView: React.FC = () => {
  const { bins, targetReportBinId, setTargetReportBinId, addReport, setUserTab, showToast } = useApp();

  const [issueType, setIssueType] = useState<ReportIssueType>('Penuh');
  const [activeCategory, setActiveCategory] = useState<IssueCategory>('fisik');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [reportText, setReportText] = useState<string>('');
  const [isChangingBin, setIsChangingBin] = useState(false);
  const [reporterType, setReporterType] = useState<ReporterRole>('Mahasiswa');
  const [validationError, setValidationError] = useState<string | null>(null);

  const currentBin = bins.find(b => b.id === targetReportBinId) || bins[0];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Ukuran Terlalu Besar', 'Maksimal ukuran foto adalah 5 MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
        setValidationError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoPreview(null);
  };

  const handleApplyChip = (chip: string) => {
    if (!reportText) {
      setReportText(chip);
    } else if (!reportText.includes(chip)) {
      setReportText(prev => `${prev}. ${chip}`);
    }
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare note directly from Section 2 description
    const finalNote = reportText.trim();

    // Run shared validation logic
    const validation = validateReportSubmission({
      binId: currentBin.id,
      issueType,
      photoUrl: photoPreview || undefined,
      notes: finalNote
    });

    if (!validation.isValid) {
      setValidationError(validation.errorMessage || 'Periksa kembali formulir laporan Anda.');
      return;
    }

    setValidationError(null);

    addReport({
      binId: currentBin.id,
      issueType,
      photoUrl: photoPreview || undefined,
      notes: finalNote || `Laporan ${issueType} pada ${currentBin.name} (${currentBin.building})`,
      reporter: reporterType
    });

    // Navigate to petugass view or map to show updated status
    setTimeout(() => {
      setUserTab('petugas');
    }, 800);
  };

  const activeOption = ISSUE_OPTIONS.find(o => o.type === issueType) || ISSUE_OPTIONS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#234629] text-xs font-semibold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Layanan Pengaduan Sarpras Kampus
            </div>
            <h1 className="text-3xl font-extrabold text-[#1A231C] tracking-tight">Lapor kondisi tong</h1>
            <p className="text-slate-500 text-sm mt-1">
              Bisa kirim teks deskripsi saja, foto bukti, atau keduanya sekaligus. Tanpa login akun.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Step 1: Apa masalahnya? (Intuitive Categorized Selector - Zero Overload) */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#234629] text-white text-xs flex items-center justify-center font-bold">1</span>
                  <span>Apa masalahnya?</span>
                </label>
                <span className="text-[11px] font-medium text-slate-400">Pilih jenis kendala</span>
              </div>

              {/* Direct 1-Tap Issue Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ISSUE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = issueType === opt.type;
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => {
                        setIssueType(opt.type);
                        setValidationError(null);
                      }}
                      className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        isSelected
                          ? `${opt.colorClass} ring-2 shadow-xs scale-[1.02]`
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-white shadow-2xs' : 'bg-slate-100'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                          {opt.label}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-tight line-clamp-1">
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Deskripsi Teks Laporan (NEW FEATURE REQUEST) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#234629] text-white text-xs flex items-center justify-center font-bold">2</span>
                  <span>Deskripsi / Catatan Laporan (Teks)</span>
                </label>
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Bisa tanpa foto
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2.5">
                Tuliskan penjelasan detail kondisi tong untuk membantu petugas menemukan dan menangani masalah lebih cepat:
              </p>

              <div className="relative">
                <textarea
                  rows={3}
                  value={reportText}
                  onChange={(e) => {
                    setReportText(e.target.value);
                    setValidationError(null);
                  }}
                  placeholder="Contoh: Sampah botol anorganik sudah meluber hingga ke lantai depan pintu, banyak lalat dan berbau asam..."
                  className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#234629] focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Quick Text Suggestions */}
              <div className="mt-2.5">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                  Klik saran teks cepat:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_TEXT_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleApplyChip(chip)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-[11px] text-slate-600 transition-colors cursor-pointer border border-slate-200/60"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Tambah Foto (Opsional) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#234629] text-white text-xs flex items-center justify-center font-bold">3</span>
                  <span>Foto Bukti</span>
                </label>
                <span className="text-[11px] font-medium text-slate-400">
                  Opsional (Maks. 5 MB)
                </span>
              </div>

              <label className="border-2 border-dashed border-slate-200 hover:border-[#234629]/50 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#FAFBF9] relative group">
                {photoPreview ? (
                  <div className="relative w-full max-h-52 overflow-hidden rounded-xl border border-slate-200">
                    <img src={photoPreview} alt="Foto kondisi tong" className="w-full h-full object-cover max-h-52" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <span className="text-xs font-bold text-white bg-black/60 px-3 py-1.5 rounded-lg">
                        Ganti Foto
                      </span>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        title="Hapus foto"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-11 h-11 rounded-full bg-[#E8EFE8] text-[#234629] flex items-center justify-center mb-1.5">
                      <Camera className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-xs sm:text-sm text-slate-800">
                      Ambil foto atau unggah gambar
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG, atau WEBP (jika ada)</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>

            {/* Step 4: Lokasi Tong & Identitas Pelapor */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2.5 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#234629] text-white text-xs flex items-center justify-center font-bold">4</span>
                <span>Lokasi &amp; Identitas</span>
              </label>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#234629] shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {currentBin.name} · {currentBin.building}
                      </h4>
                      <p className="text-xs text-slate-500 truncate">
                        {currentBin.locationDetail} · Jarak: {currentBin.distanceM} m
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsChangingBin(!isChangingBin)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#234629] hover:bg-[#234629]/10 transition-colors shrink-0"
                  >
                    Ubah
                  </button>
                </div>

                {/* Bin Selector Dropdown if user clicks "Ubah" */}
                {isChangingBin && (
                  <div className="pt-2 border-t border-slate-200/80 space-y-2 animate-in fade-in">
                    <p className="text-xs font-semibold text-slate-700">Pilih titik tong lain di kampus UPNVJ:</p>
                    <div className="max-h-44 overflow-y-auto space-y-1 pr-1">
                      {bins.map(b => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            setTargetReportBinId(b.id);
                            setIsChangingBin(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
                            b.id === currentBin.id ? 'bg-[#E8EFE8] font-bold text-[#234629]' : 'hover:bg-white text-slate-700'
                          }`}
                        >
                          <span className="truncate">{b.name} ({b.building} - {b.locationDetail.split(',')[0]})</span>
                          <span className="text-[11px] text-slate-500 shrink-0 ml-2">{b.distanceM} m</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reporter Role Selector */}
                <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-slate-700">Peran Pelapor:</span>
                  <div className="grid grid-cols-4 gap-1.5 sm:flex sm:items-center">
                    {(['Mahasiswa', 'Dosen', 'Petugas', 'Tamu'] as const).map(role => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setReporterType(role)}
                        className={`py-2 px-2.5 sm:px-3 rounded-xl font-bold text-xs text-center transition-all cursor-pointer min-h-[38px] flex items-center justify-center ${
                          reporterType === role
                            ? 'bg-[#234629] text-white shadow-xs ring-1 ring-[#234629]'
                            : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-2xs'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Error Message */}
            {validationError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base text-white bg-[#234629] hover:bg-[#1b3620] shadow-sm active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Kirim laporan sekarang</span>
                <ArrowRight className="w-4 h-4 text-emerald-300" />
              </button>
              <p className="text-center text-xs text-slate-500 mt-3 flex items-center justify-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Notifikasi terkirim otomatis ke sistem WhatsApp petugas kebersihan kampus.</span>
              </p>
            </div>
          </form>
        </div>

        {/* Right Info & Live WhatsApp Preview Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* WhatsApp Preview Card (Figma Page 5 Live Interactive Replica) */}
          <div className="rounded-3xl overflow-hidden border border-slate-300 shadow-md bg-[#E5DDD5]">
            {/* WhatsApp Header */}
            <div className="bg-[#234629] px-4 py-3.5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs">
                  VB
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">
                    WhatsApp · Petugas Kebersihan
                  </div>
                  <div className="text-[10px] text-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online · Notifikasi Otomatis
                  </div>
                </div>
              </div>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white font-medium">
                Live Preview
              </span>
            </div>

            {/* Chat Body */}
            <div className="p-4 space-y-3">
              <div className="bg-white rounded-2xl rounded-tl-none p-3.5 shadow-xs max-w-[95%] space-y-2 text-xs">
                {/* Header of message */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${activeOption.badgeBg}`}>
                    {activeOption.label}
                  </span>
                  <span className="text-[10px] text-slate-400">Baru saja</span>
                </div>

                {/* Location & Bin Category */}
                <div>
                  <p className="font-bold text-slate-900 text-xs">
                    {currentBin.name} ({currentBin.category})
                  </p>
                  <p className="text-[11px] text-slate-600">
                    📍 {currentBin.building} · {currentBin.locationDetail}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Pelapor: <span className="font-semibold text-slate-600">{reporterType}</span>
                  </p>
                </div>

                {/* User Text Note Preview */}
                {reportText ? (
                  <div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-100 text-slate-800 text-[11px] leading-relaxed">
                    <span className="font-bold text-[#234629] block mb-0.5">Catatan Pelapor:</span>
                    "{reportText}"
                  </div>
                ) : (
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400 text-[10px] italic border border-slate-100">
                    (Belum ada catatan teks tambahan)
                  </div>
                )}

                {/* Photo Preview if uploaded */}
                {photoPreview ? (
                  <div className="mt-1.5 rounded-xl overflow-hidden border border-slate-200 max-h-40">
                    <img src={photoPreview} alt="Bukti Foto" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400 text-[10px] italic border border-slate-100 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tanpa lampiran foto (Laporan berbasis teks)</span>
                  </div>
                )}

                {/* Message footer timestamp */}
                <div className="text-right text-[9px] text-slate-400 pt-1">
                  14:32 ✓✓
                </div>
              </div>
            </div>
          </div>

          {/* Setelah Kamu Lapor Steps */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="font-extrabold text-base text-slate-900 mb-4">Setelah kamu kirim laporan:</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#E8EFE8] text-[#234629] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">Status tong diperbarui di peta</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Titik tong langsung ditandai dengan peringatan status untuk seluruh warga kampus.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#E8EFE8] text-[#234629] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">WhatsApp petugas piket menerima pesan</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pesan berisi lokasi spesifik, rute koridor, catatan deskripsi, dan foto bukti.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#E8EFE8] text-[#234629] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">Petugas mengosongkan &amp; perbaiki</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Setelah ditangani, petugas menekan tombol konfirmasi dan status tong kembali normal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
