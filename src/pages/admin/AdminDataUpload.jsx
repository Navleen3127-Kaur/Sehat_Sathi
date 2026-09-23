import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw, 
  Download, 
  Database,
  Check
} from 'lucide-react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { adminService } from '../../services/adminService';
import { SAMPLE_CSV_TEMPLATE } from '../../data/adminMockData';
import { useToast } from '../../context/ToastContext';

export const AdminDataUpload = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // 4-stage workflow states: 'idle' -> 'validating' -> 'preview' -> 'imported'
  const [stage, setStage] = useState('idle');
  const [csvContent, setCsvContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a valid .csv file format.');
      addToast('Invalid file format. Only CSV files supported.', 'error');
      return;
    }

    setFileName(file.name);
    setFileSize(`${(file.size / 1024).toFixed(1)} KB`);
    setError(null);
    setStage('validating');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      setCsvContent(text);
      try {
        const result = await adminService.parseAndValidateCsv(text);
        setParsedData(result);
        setStage('preview');
        addToast(`Validated ${result.totalRows} hospital records in dataset`, 'success');
      } catch (err) {
        setError(err.message || 'Error validating CSV headers');
        setStage('idle');
        addToast('CSV validation failed', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleLoadDemoCsv = async () => {
    setFileName('chandigarh_tricity_hospitals_q3_2026.csv');
    setFileSize('1.4 KB');
    setCsvContent(SAMPLE_CSV_TEMPLATE);
    setError(null);
    setStage('validating');

    try {
      const result = await adminService.parseAndValidateCsv(SAMPLE_CSV_TEMPLATE);
      setParsedData(result);
      setStage('preview');
      addToast(`Loaded sample CSV with ${result.totalRows} records`, 'info');
    } catch (err) {
      setError(err.message);
      setStage('idle');
    }
  };

  const handleImport = async () => {
    if (!parsedData || !parsedData.preview) return;
    setStage('validating');

    try {
      const res = await adminService.importCsvData(parsedData.preview);
      setImportResult(res);
      setStage('imported');
      addToast(`Successfully imported ${res.importedCount} new hospitals to registry!`, 'success');
    } catch (err) {
      setError('Failed to complete dataset import.');
      setStage('preview');
    }
  };

  const handleReset = () => {
    setStage('idle');
    setCsvContent('');
    setFileName('');
    setFileSize('');
    setParsedData(null);
    setImportResult(null);
    setError(null);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader 
          title="Upload Hospital Dataset"
          subtitle="Bulk import regional hospital records, accreditations, and bed inventories via CSV"
        />

        <div className="p-6 sm:p-8 space-y-6 max-w-5xl">
          
          {/* Progress Flow Steps */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-soft text-xs font-semibold">
            <div className={`flex items-center gap-2 ${stage === 'idle' ? 'text-teal-700 font-bold' : 'text-slate-500'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                stage !== 'idle' ? 'bg-teal-600 text-white' : 'bg-teal-100 text-teal-800'
              }`}>
                {stage !== 'idle' ? <Check className="w-3.5 h-3.5" /> : '1'}
              </div>
              <span className="hidden sm:inline">1. Select CSV</span>
            </div>

            <div className={`flex items-center gap-2 ${stage === 'validating' ? 'text-teal-700 font-bold' : 'text-slate-500'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                stage === 'preview' || stage === 'imported' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {stage === 'preview' || stage === 'imported' ? <Check className="w-3.5 h-3.5" /> : '2'}
              </div>
              <span className="hidden sm:inline">2. Validate Schema</span>
            </div>

            <div className={`flex items-center gap-2 ${stage === 'preview' ? 'text-teal-700 font-bold' : 'text-slate-500'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                stage === 'imported' ? 'bg-teal-600 text-white' : stage === 'preview' ? 'bg-teal-100 text-teal-800 font-bold' : 'bg-slate-100 text-slate-600'
              }`}>
                {stage === 'imported' ? <Check className="w-3.5 h-3.5" /> : '3'}
              </div>
              <span className="hidden sm:inline">3. Preview Records</span>
            </div>

            <div className={`flex items-center gap-2 ${stage === 'imported' ? 'text-teal-700 font-bold' : 'text-slate-500'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                stage === 'imported' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                4
              </div>
              <span className="hidden sm:inline">4. Import & Save</span>
            </div>
          </div>

          {/* STAGE 1: DRAG & DROP UPLOAD */}
          {stage === 'idle' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-card space-y-6">
              <div className="text-center max-w-md mx-auto space-y-2">
                <h3 className="text-base font-bold text-slate-900">
                  Select or Drag CSV Dataset
                </h3>
                <p className="text-xs text-slate-500">
                  Accepted format: <strong>.CSV</strong> (Comma Separated Values). Maximum 5,000 hospital records per upload batch.
                </p>
              </div>

              {/* Drag zone */}
              <label className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-teal-50/30 transition-all space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-teal-700 block">Click to browse your computer</span>
                  <span className="text-[11px] text-slate-400">or drop CSV file directly into this area</span>
                </div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Sample template download / 1-click test button */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="text-slate-500">
                  Don't have a file ready? Test with sample dataset:
                </span>

                <button
                  type="button"
                  onClick={handleLoadDemoCsv}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Load Demo Healthcare CSV</span>
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2: VALIDATING SKELETON */}
          {stage === 'validating' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-card space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-teal-600 border-t-transparent animate-spin mx-auto"></div>
              <h3 className="font-bold text-slate-900 text-sm">Validating CSV Columns & Datatypes...</h3>
              <p className="text-xs text-slate-500">
                Checking required fields: name, beds, icuBeds, specialties, facilities.
              </p>
            </div>
          )}

          {/* STAGE 3: PREVIEW */}
          {stage === 'preview' && parsedData && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-slate-900 text-base">Validation Passed</h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    File: <span className="font-semibold text-slate-800">{fileName}</span> ({fileSize}) · Detected <span className="font-bold text-teal-700">{parsedData.totalRows} records</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Upload Different</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleImport}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Proceed to Import ({parsedData.totalRows})</span>
                  </button>
                </div>
              </div>

              {/* Data Table Preview */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Dataset Sample Preview (First {parsedData.preview.length} Rows)
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Name</th>
                        <th className="py-2.5 px-3">City</th>
                        <th className="py-2.5 px-3">Beds</th>
                        <th className="py-2.5 px-3">ICU</th>
                        <th className="py-2.5 px-3">Emergency</th>
                        <th className="py-2.5 px-3">Accreditation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedData.preview.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{row.name}</td>
                          <td className="py-2.5 px-3 text-slate-700">{row.city}</td>
                          <td className="py-2.5 px-3 text-slate-700">{row.beds}</td>
                          <td className="py-2.5 px-3 text-slate-700">{row.icuBeds}</td>
                          <td className="py-2.5 px-3 text-teal-700 font-semibold">{row.emergency24x7}</td>
                          <td className="py-2.5 px-3 text-slate-600">{row.accreditation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: IMPORTED SUCCESS */}
          {stage === 'imported' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-card space-y-5 animate-fade-in max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900">
                  Dataset Successfully Imported
                </h3>
                <p className="text-xs text-slate-500">
                  All {importResult?.importedCount || 3} hospital records have been committed into the active discovery registry and are immediately searchable.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Upload Another CSV
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/hospitals')}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 shadow-sm"
                >
                  <span>View in Hospital Registry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
