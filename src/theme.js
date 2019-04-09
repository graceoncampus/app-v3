import { StyleSheet, Platform } from 'react-native';

export const variables = {
  primary: '#ae956b',
};

export const headerStyles = {
  headerStyle: {
    backgroundColor: '#fff',
    ...Platform.select({
      ios: { marginTop: 0, paddingTop: 20 },
      android: {
        elevation: 0,
        height: 43,
      },
    }),
    borderBottomWidth: 1,
    borderBottomColor: '#ecedef',
  },
  headerTitleStyle: {
    fontWeight: 'normal',
    alignSelf: 'center',
    fontFamily: 'Akkurat',
    fontSize: 15,
    color: '#222222',
    paddingTop: 4,
    lineHeight: 14,
    textAlign: 'center',
    flex: 1,
  },
};

export default StyleSheet.create({

  // Text
  textCenter: {
    textAlign: 'center',
  },

  bold: {
    fontFamily: 'Akkurat-Bold',
  },

  textSecondary: {
    color: variables.primary,
  },

  textRed: {
    color: '#b40a34',
  },

  textPrimary: {
    color: '#222',
  },

  heading: {
    fontSize: 25,
    lineHeight: 30,
  },

  title: {
    color: '#04164d',
    lineHeight: 25,
  },

  small: {
    fontSize: 14,
    lineHeight: 16,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 18,
  },

  label: {
    paddingTop: 10,
    fontSize: 12,
    color: '#848895',
    lineHeight: 16,
    letterSpacing: 0.5,
  },

  labelasterisk: {
    paddingTop: 10,
    fontSize: 12,
    color: '#b40a34',
    lineHeight: 16,
    letterSpacing: 0.5,
  },

  caption: {
    fontSize: 12,
    color: '#848895',
    lineHeight: 16,
    letterSpacing: 0.5,
  },

  buttonText: {
    fontSize: 12,
    color: '#fff',
    letterSpacing: 1,
    textAlign: 'center',
  },

  buttonTextGold: {
    fontSize: 12,
    color: variables.primary,
    letterSpacing: 1,
    textAlign: 'center',
  },

  // Layout
  borderBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e5e5',
  },

  borderTop: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e5e5',
  },

  tile: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 0,
    paddingHorizontal: 20,
    flex: 0.32,
    backgroundColor: 'transparent',
  },

  textCentric: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

  row: {
    flexGrow: 1,
    flexShrink: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 15,
  },

  // View Layout
  horizontal: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  vertical: {
    flexDirection: 'column',
  },

  stretch: {
    alignSelf: 'stretch',
  },

  spaceBetween: {
    justifyContent: 'space-between',
  },

  // Vertical

  vhCenter: {
    alignItems: 'center',
  },

  vhStart: {
    alignItems: 'flex-start',
  },

  vhEnd: {
    alignItems: 'flex-end',
  },

  vvCenter: {
    justifyContent: 'center',
  },

  vvStart: {
    justifyContent: 'flex-start',
  },

  vvEnd: {
    justifyContent: 'flex-end',
  },

  // Horizontal

  hhCenter: {
    justifyContent: 'center',
  },

  hhStart: {
    justifyContent: 'flex-start',
  },

  hhEnd: {
    justifyContent: 'flex-end',
  },

  hvCenter: {
    alignItems: 'center',
  },

  hvStart: {
    alignItems: 'flex-start',
  },

  hvEnd: {
    alignItems: 'flex-end',
  },

  fillParent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // Text Input
  input: {
    borderWidth: 1,
    borderColor: '#dfe0e3',
    fontFamily: 'Akkurat',
    marginTop: 3,
    height: 50,
    paddingVertical: 9,
    paddingHorizontal: 15,
    marginBottom: 7,
    borderRadius: 2,
  },

  multiLineInput: {
    borderWidth: 1,
    borderColor: '#dfe0e3',
    fontFamily: 'Akkurat',
    lineHeight: 15,
    fontSize: 14,
    marginTop: 3,
    paddingTop: 15.5,
    paddingBottom: 15.5,
    paddingHorizontal: 15,
    marginBottom: 7,
    borderRadius: 1,
  },

  focused: {
    borderColor: variables.primary,
    borderWidth: 2
  },
});
