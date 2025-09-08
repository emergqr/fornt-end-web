'use client';

import * as React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print'; // <-- Import Print Icon

import { useQRStore } from '@/store/qr/qr.store';

export default function QRCodePage() {
  const {
    qrData,
    isLoading,
    error,
    fetchQR,
  } = useQRStore();

  const qrCanvasRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    fetchQR();
  }, [fetchQR]);

  const handleDownload = () => {
    const canvas = qrCanvasRef.current?.querySelector('canvas');
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      let downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'EmergQR-Code.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="printable-area">
      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-qr-code, #printable-qr-code * {
            visibility: visible;
          }
          #printable-qr-code {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>

      <Typography variant="h4" component="h1" gutterBottom>
        Mi Código QR de Emergencia
      </Typography>
      
      <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
        Muestra este código al personal de emergencias para que accedan a tu información médica al instante.
      </Typography>

      {isLoading && <CircularProgress sx={{ my: 4 }} />}
      {error && !isLoading && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
      
      {qrData && !isLoading && (
        // Add an ID to the printable element
        <Box id="printable-qr-code" ref={qrCanvasRef} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, my: 2 }}>
          <QRCodeCanvas 
            value={qrData}
            size={256}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"H"}
            includeMargin={true}
          />
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button 
          variant="contained" 
          startIcon={<DownloadIcon />} 
          onClick={handleDownload}
          disabled={!qrData || isLoading}
        >
          Descargar QR
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<PrintIcon />} 
          onClick={handlePrint}
          disabled={!qrData || isLoading}
        >
          Imprimir
        </Button>
      </Box>
    </Paper>
  );
}
