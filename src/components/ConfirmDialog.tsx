// @mui
import { Dialog, DialogTitle, DialogActions, Typography, Button } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  text: string;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmDialog({ open, text, onConfirm, onClose}: Props) {

  const handleConfirm = () => {
    onClose()
    onConfirm()
  }

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle>
        <Typography gutterBottom>
          { text }
        </Typography>
      </DialogTitle>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={ onClose }>
          Отмена
        </Button>
        <Button variant="contained" color="error" onClick={ handleConfirm }>
          Подтвердить
        </Button>
      </DialogActions>
    </Dialog>
  );
}
