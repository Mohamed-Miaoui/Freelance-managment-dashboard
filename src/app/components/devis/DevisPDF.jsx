import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Professional black & white styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: "Helvetica",
    lineHeight: 1.3,
  },
  // Header Section
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
  },
  companyInfo: {
    width: "50%",
  },
  companyName: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  companyDetails: {
    fontSize: 8,
    color: "#333333",
    marginBottom: 1,
  },
  devisSection: {
    width: "45%",
    textAlign: "right",
  },
  devisTitle: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    marginBottom: 20,
    letterSpacing: 1,
  },
  devisNumber: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 8,
    color: "#333333",
    marginBottom: 1,
  },

  // Client Section
  clientSection: {
    marginBottom: 18,
    padding: 12,
    backgroundColor: "#f8f8f8",
    borderLeftWidth: 3,
    borderLeftColor: "#000000",
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  clientName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  clientDetail: {
    fontSize: 8,
    color: "#333333",
    marginBottom: 1,
  },

  // Table
  table: {
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
    paddingVertical: 6,
    backgroundColor: "#f0f0f0",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#cccccc",
    paddingVertical: 5,
    minHeight: 20,
  },
  colDescription: {
    width: "75%",
    paddingRight: 8,
  },
  colAmount: {
    width: "25%",
    textAlign: "right",
  },
  tableHeaderText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  tableCellText: {
    fontSize: 8,
  },
  tableCellAmount: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },

  // Totals
  totalsSection: {
    marginLeft: "auto",
    width: "45%",
    marginBottom: 15,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: "#cccccc",
  },
  totalLabel: {
    fontSize: 8,
    color: "#333333",
  },
  totalValue: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginTop: 5,
    backgroundColor: "#000000",
    color: "#ffffff",
    paddingHorizontal: 10,
  },
  grandTotalLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  grandTotalValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  acompteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    marginTop: 3,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#000000",
  },
  acompteText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },

  // Conditions & Notes
  infoBox: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#f8f8f8",
    borderLeftWidth: 2,
    borderLeftColor: "#000000",
  },
  infoTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 7,
    lineHeight: 1.4,
    color: "#333333",
  },

  // Signatures
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#000000",
  },
  signatureBox: {
    width: "45%",
    textAlign: "center",
  },
  signatureLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    marginBottom: 25,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#000000",
    paddingTop: 3,
    marginTop: 5,
  },
  signatureNote: {
    fontSize: 7,
    color: "#666666",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 7,
    color: "#999999",
    borderTopWidth: 0.5,
    borderTopColor: "#cccccc",
    paddingTop: 6,
  },
});

const DevisPDF = ({ devis, clientInfo }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-TN", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(amount);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{clientInfo.nom}</Text>
            <Text style={styles.companyDetails}>{clientInfo.adresse}</Text>
            <Text style={styles.companyDetails}>
              Tél: {clientInfo.telephone}
            </Text>
            <Text style={styles.companyDetails}>Email: {clientInfo.email}</Text>
            <Text style={styles.companyDetails}>
              M.F: {clientInfo.matricule_fiscal}
            </Text>
          </View>

          <View style={styles.devisSection}>
            <Text style={styles.devisTitle}>DEVIS</Text>
            <Text style={styles.devisNumber}>N° {devis.numero}</Text>
            <Text style={styles.dateText}>
              Date: {formatDate(devis.date_emission)}
            </Text>
            <Text style={styles.dateText}>
              Validité: {formatDate(devis.date_validite)}
            </Text>
          </View>
        </View>

        {/* Client Info */}
        <View style={styles.clientSection}>
          <Text style={styles.sectionTitle}>Destinataire</Text>
          <Text style={styles.clientName}>{devis.client_id?.nom}</Text>
          <Text style={styles.clientDetail}>{devis.client_id?.adresse}</Text>
          <Text style={styles.clientDetail}>
            Tél: {devis.client_id?.telephone}
          </Text>
          <Text style={styles.clientDetail}>
            Email: {devis.client_id?.email}
          </Text>
          <Text style={styles.clientDetail}>
            M.F: {devis.client_id?.matricule_fiscal}
          </Text>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colDescription, styles.tableHeaderText]}>
              Description
            </Text>
            <Text style={[styles.colAmount, styles.tableHeaderText]}>
              Montant (TND)
            </Text>
          </View>
          {devis.lignes?.map((ligne, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.colDescription, styles.tableCellText]}>
                {ligne.description}
              </Text>
              <Text style={[styles.colAmount, styles.tableCellAmount]}>
                {formatCurrency(ligne.montant)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Montant HT:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(devis.montant_ht)} TND
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TVA ({devis.tva}%):</Text>
            <Text style={styles.totalValue}>
              {formatCurrency((devis.montant_ht * devis.tva) / 100)} TND
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Timbre Fiscal:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(devis.timbre_fiscal)} TND
            </Text>
          </View>

          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>TOTAL TTC</Text>
            <Text style={styles.grandTotalValue}>
              {formatCurrency(devis.montant_ttc)} TND
            </Text>
          </View>

          {devis.montant_acompte > 0 && (
            <View style={styles.acompteRow}>
              <Text style={styles.acompteText}>Acompte demandé:</Text>
              <Text style={styles.acompteText}>
                {formatCurrency(devis.montant_acompte)} TND
              </Text>
            </View>
          )}
        </View>

        {/* Payment Conditions */}
        {devis.conditions_paiement && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Conditions de Paiement</Text>
            <Text style={styles.infoText}>{devis.conditions_paiement}</Text>
          </View>
        )}

        {/* Notes */}
        {devis.notes && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Notes</Text>
            <Text style={styles.infoText}>{devis.notes}</Text>
          </View>
        )}

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>LE PRESTATAIRE</Text>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureNote}>Signature & Cachet</Text>
            </View>
          </View>

          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>LE CLIENT</Text>
            <Text style={styles.signatureNote}>(Bon pour accord)</Text>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureNote}>Signature & Date</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          {clientInfo.nom} • {clientInfo.email} • {clientInfo.telephone}
        </Text>
      </Page>
    </Document>
  );
};

export default DevisPDF;
