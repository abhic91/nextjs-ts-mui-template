import { FormControlLabel, FormControlLabelProps, styled } from '@mui/material';

interface IFormControlLabelBorderedProps extends FormControlLabelProps {
  active: boolean;
}

export const FormControlLabelBordered = styled(FormControlLabel, {
  shouldForwardProp: (prop) => prop !== 'active',
})<IFormControlLabelBorderedProps>(({ theme, active }) => {
  const primaryColor = theme.palette.primary.main;
  const inactiveTxtColor = theme.palette.grey[600];
  const darkerGrey = theme.palette.grey[600];
  const lightGrey = theme.palette.grey[400];
  return {
    borderRadius: '8px',
    paddingRight: theme.spacing(2),
    border: `1px solid ${active ? primaryColor : lightGrey}`,
    color: active ? primaryColor : inactiveTxtColor,
    // '&:active': {
    //   border: `1px solid ${active ? primaryColor : theme.palette.grey[500]}`,
    //   color: active ? primaryColor : theme.palette.grey[600],
    // },
    '&:hover': {
      border: `1px solid ${active ? primaryColor : darkerGrey}`,
      color: active ? primaryColor : inactiveTxtColor,
    },
  };
});
