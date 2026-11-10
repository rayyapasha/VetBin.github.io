import { ReportIssueType } from '../types';

export interface ReportValidationInput {
  binId: string;
  issueType: ReportIssueType;
  photoUrl?: string;
  notes?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Validates report submission:
 * Users must provide either a text description, a photo, or choose a recognized issue category.
 * If 'Lainnya' is selected, a non-empty description is mandatory.
 */
export function validateReportSubmission(input: ReportValidationInput): ValidationResult {
  if (!input.binId || input.binId.trim() === '') {
    return { isValid: false, errorMessage: 'Titik tong wajib dipilih.' };
  }

  if (input.issueType === 'Lainnya') {
    if (!input.notes || input.notes.trim().length < 3) {
      return {
        isValid: false,
        errorMessage: 'Silakan tuliskan penjelasan masalah Anda pada kolom teks yang tersedia.'
      };
    }
  }

  // If both photo and notes are completely empty and it's not a standard predefined status
  const hasText = Boolean(input.notes && input.notes.trim().length > 0);
  const hasPhoto = Boolean(input.photoUrl && input.photoUrl.trim().length > 0);

  if (!hasText && !hasPhoto) {
    // Predefined quick issues (like Penuh, Rusak) can be sent with default notes, but Lainnya cannot
    if (input.issueType === 'Lainnya') {
      return { isValid: false, errorMessage: 'Harap sertakan foto atau catatan teks.' };
    }
  }

  return { isValid: true };
}

/**
 * Categorizes student traffic level based on campus building / location
 */
export function getCampusTrafficPriority(building: string): 'Tinggi' | 'Sedang' | 'Normal' {
  const highTrafficKeywords = ['kantin', 'lapangan', 'rektorat', 'sudirman', 'parkir'];
  const mediumTrafficKeywords = ['thamrin', 'feb', 'fik', 'teknik', 'masjid'];

  const lower = building.toLowerCase();
  if (highTrafficKeywords.some(k => lower.includes(k))) {
    return 'Tinggi';
  }
  if (mediumTrafficKeywords.some(k => lower.includes(k))) {
    return 'Sedang';
  }
  return 'Normal';
}

/**
 * Formats WhatsApp dispatch template
 */
export function generateWhatsAppDispatchMessage(params: {
  issueType: ReportIssueType;
  binName: string;
  building: string;
  locationDetail: string;
  notes?: string;
  reporter?: string;
}): string {
  const reporter = params.reporter || 'Mahasiswa';
  const notesText = params.notes ? `\n📝 Catatan: "${params.notes}"` : '';
  return `[LAPORAN VETBIN] Tong ${params.issueType.toUpperCase()}\nTitik: ${params.binName}\nLokasi: ${params.building} (${params.locationDetail})\nPelapor: ${reporter}${notesText}`;
}
