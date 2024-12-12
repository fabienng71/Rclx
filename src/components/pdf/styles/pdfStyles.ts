import { StyleSheet } from '@react-pdf/renderer';

export const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF'
  },
  quotationTitleContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1
  },
  quotationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7f1d1d',
    opacity: 0.9
  },
  header: {
    width: '50%',
    marginBottom: 20,
    zIndex: 2
  },
  repertoire: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7f1d1d'
  },
  culinaire: {
    fontSize: 28,
    fontWeight: 'light',
    color: '#7f1d1d',
    marginTop: 2
  },
  details: {
    marginTop: 8
  },
  companyName: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 2
  },
  text: {
    fontSize: 9,
    marginBottom: 2
  },
  senderInfo: {
    marginTop: 8
  },
  customerInfo: {
    position: 'absolute',
    top: 40,
    right: 40,
    width: '40%',
    textAlign: 'right',
    zIndex: 2
  },
  table: {
    marginTop: 80,
    marginBottom: 40
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 6,
    backgroundColor: '#f3f4f6'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    paddingVertical: 6
  },
  col1: { width: '12%' },
  col2: { width: '40%' },
  col3: { width: '16%', textAlign: 'right' },
  col4: { width: '16%', textAlign: 'right' },
  col5: { width: '16%', textAlign: 'right' },
  headerCell: {
    fontSize: 9,
    fontWeight: 'bold'
  },
  cell: {
    fontSize: 9
  },
  terms: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  termsSection: {
    width: '45%'
  },
  termsTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 6
  },
  termsList: {
    marginTop: 4
  },
  termsItem: {
    fontSize: 8,
    marginBottom: 4
  }
});