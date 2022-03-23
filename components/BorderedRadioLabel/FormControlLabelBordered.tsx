import { FormControlLabel, FormControlLabelProps, lighten, styled } from '@mui/material';

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
    '& .MuiRadio-root': {
      'span:first-of-type': {
        backgroundColor: active ? lighten(primaryColor, 0.9) : 'transparent',
        borderRadius: '50%',
        border: `1px solid ${active ? 'transparent' : lightGrey}`,
      },
      '& .MuiSvgIcon-root:first-of-type': {
        fill: 'transparent',
      },
    },
    // '& .MuiSvgIcon-root:first-of-type': {
    //   fill: 'transparent',
    // },
    // '& .MuiSvgIcon-root': {
    //   backgroundColor: active ? lighten(primaryColor, 0.96) : 'transparent',
    //   borderRadius: '50%',
    //   border: `1px solid ${active ? 'transparent' : theme.palette.grey[300]}`,
    // },
  };
});
