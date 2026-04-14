import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Tags, Search } from 'lucide-react';
import { toast } from 'sonner';
import { etiquetasService, empresasService } from '../../shared/services';
import { getErrorMessage } from '../../shared/lib/errorUtils';
import FormEtiquetas from './FormEtiquetas';

export default function Etiquetas() {
  const [etiquetas, setEtiquetas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    try {
      const [et, emp] = await Promise.all([etiquetasService.getAll(), empresasService.getAll()]);
      setEtiquetas(et);
      setEmpresas(emp);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Error al cargar las etiquetas'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (etiqueta) => {
    if (!confirm(`¿Eliminar la etiqueta "${etiqueta.nombre}"?`)) return;
    try {
      await etiquetasService.delete(etiqueta.id);
      toast.success('Etiqueta eliminada');
      loadData();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Error al eliminar la etiqueta'));
    }
  };

  const handleSave = async (data) => {
    try {
      if (editItem) {
        await etiquetasService.update(editItem.id, data);
        toast.success('Etiqueta actualizada');
      } else {
        await etiquetasService.create(data);
        toast.success('Etiqueta creada');
      }
      setFormOpen(false);
      setEditItem(null);
      loadData();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Error al guardar la etiqueta'));
    }
  };

  const filtered = etiquetas.filter((e) => e.nombre?.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Etiquetas</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{etiquetas.length} etiquetas</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Etiqueta
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar etiqueta..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <AnimatePresence>
          {filtered.map((etiqueta) => (
            <motion.div
              key={etiqueta.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 px-4 py-3 hover:shadow-md transition-shadow flex items-center gap-3 group"
            >
              <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: etiqueta.color || '#6366f1' }} />
              <div>
                <span className="font-medium text-slate-800 dark:text-white text-sm">{etiqueta.nombre}</span>
                {etiqueta.empresaNombre && (
                  <p className="text-xs text-slate-400">{etiqueta.empresaNombre}</p>
                )}
              </div>
              <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => { setEditItem(etiqueta); setFormOpen(true); }}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-500 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(etiqueta)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Tags className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No se encontraron etiquetas</p>
        </div>
      )}

      <AnimatePresence>
        {formOpen && (
          <FormEtiquetas
            onClose={() => { setFormOpen(false); setEditItem(null); }}
            onSave={handleSave}
            initialData={editItem}
            empresas={empresas}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
