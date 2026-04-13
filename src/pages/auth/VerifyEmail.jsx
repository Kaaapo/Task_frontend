import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { verificarEmail, reenviarVerificacion } = useAuth();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (token) {
      verify();
    } else {
      setStatus('no-token');
    }
  }, [token]);

  const verify = async () => {
    try {
      const data = await verificarEmail(token);
      setStatus('success');
      setMessage(data.mensaje || 'Email verificado correctamente');
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Error al verificar el email');
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    setResending(true);
    try {
      await reenviarVerificacion(resendEmail);
      toast.success('Email de verificacion reenviado');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al reenviar');
    } finally {
      setResending(false);
    }
  };

  const icons = {
    loading: <Loader2 className="w-16 h-16 text-blue-400 animate-spin" />,
    success: <CheckCircle className="w-16 h-16 text-emerald-400" />,
    error: <XCircle className="w-16 h-16 text-red-400" />,
    'no-token': <Mail className="w-16 h-16 text-yellow-400" />,
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="mb-6 inline-block"
          >
            {icons[status]}
          </motion.div>

          <h1 className="text-2xl font-bold text-white mb-2">
            {status === 'loading' && 'Verificando...'}
            {status === 'success' && 'Email Verificado'}
            {status === 'error' && 'Error de Verificacion'}
            {status === 'no-token' && 'Verificar Email'}
          </h1>

          <p className="text-slate-400 mb-6">
            {status === 'loading' && 'Estamos verificando tu correo electronico'}
            {status === 'success' && message}
            {status === 'error' && message}
            {status === 'no-token' && 'Ingresa tu email para reenviar el enlace de verificacion'}
          </p>

          {(status === 'error' || status === 'no-token') && (
            <form onSubmit={handleResend} className="space-y-4 mb-6">
              <input
                type="email"
                required
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="tu@email.com"
              />
              <button
                type="submit"
                disabled={resending}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
              >
                {resending ? 'Reenviando...' : 'Reenviar verificacion'}
              </button>
            </form>
          )}

          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Ir a Iniciar Sesion
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
