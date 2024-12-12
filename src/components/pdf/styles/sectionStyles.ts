import { StyleSheet } from '@react-pdf/renderer';

export const headerStyles = StyleSheet.create({
  container: {
    width: '50%',
    marginBottom: 20
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
  senderTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 2
  }
});

export const tableStyles = StyleSheet.create({
  container: {
    marginTop: 40,
    marginBottom: 40
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 6,
    backgroundColor: '#f3f4f6'
  },
  headerCell: {
    fontSize: 9,
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    paddingVertical: 6
  },
  cell: {
    fontSize: 9
  },
  col1: { width: '12%' },
  col2: { width: '40%' },
  col3: { width: '16%', textAlign: 'right' },
  col4: { width: '16%', textAlign: 'right' },
  col5: { width: '16%', textAlign: 'right' }
});

export const termsStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  sellingConditions: {
    width: '45%'
  },
  paymentTerms: {
    width: '45%',
    alignItems: 'flex-end'
  },
  title: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 6
  },
  list: {
    marginTop: 4
  },
  item: {
    fontSize: 8,
    marginBottom: 4,
    textAlign: 'right'
  }
});

export const footerStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center'
  },
  pageNumber: {
    fontSize: 8,
    color: '#666'
  }
});