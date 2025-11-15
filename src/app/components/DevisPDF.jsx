import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  companyInfo: {
    width: "45%",
  },
  companyName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 10,
  },
  devisTitle: {
    textAlign: "right",
    width: "45%",
  },
  devisTitleBox: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: 10,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  devisNumber: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  smallText: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 2,
  },
  clientBox: {
    backgroundColor: "#f9fafb",
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#2563eb",
    marginBottom: 20,
  },
  clientTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#6b7280",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  clientName: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    color: "white",
    padding: 10,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    padding: 10,
  },
  descriptionColumn: {
    width: "70%",
  },
  amountColumn: {
    width: "30%",
    textAlign: "right",
  },
  totalsContainer: {
    marginLeft: "auto",
    width: "40%",
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  totalLabel: {
    fontSize: 9,
    color: "#6b7280",
  },
  totalValue: {
    fontSize: 9,
    fontWeight: "bold",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#2563eb",
    color: "white",
    padding: 10,
    marginTop: 5,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  acompteBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0fdf4",
    padding: 8,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#86efac",
    color: "#166534",
  },
  conditionsBox: {
    backgroundColor: "#fefce8",
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#facc15",
    marginBottom: 15,
  },
  notesBox: {
    backgroundColor: "#f9fafb",
    padding: 15,
    marginBottom: 20,
  },
  boxTitle: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 8,
    color: "#374151",
  },
  boxText: {
    fontSize: 9,
    lineHeight: 1.5,
    color: "#374151",
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: "#d1d5db",
  },
  signatureBox: {
    width: "45%",
    textAlign: "center",
  },
  signatureLabel: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 40,
  },
  signatureLine: {
    borderTopWidth: 2,
    borderTopColor: "#9ca3af",
    paddingTop: 5,
    marginTop: 10,
  },
  signatureNote: {
    fontSize: 8,
    color: "#6b7280",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
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
            <Text style={styles.smallText}>{clientInfo.adresse}</Text>
            <Text style={styles.smallText}>Tél: {clientInfo.telephone}</Text>
            <Text style={styles.smallText}>Email: {clientInfo.email}</Text>
            <Text style={styles.smallText}>
              M.F: {clientInfo.matricule_fiscal}
            </Text>
          </View>

          <View style={styles.devisTitle}>
            <View style={styles.devisTitleBox}>
              <Text>DEVIS</Text>
            </View>
            <Text style={styles.devisNumber}>N° {devis.numero}</Text>
            <Text style={styles.smallText}>
              Date: {formatDate(devis.date_emission)}
            </Text>
            <Text style={styles.smallText}>
              Validité: {formatDate(devis.date_validite)}
            </Text>
          </View>
        </View>

        {/* Client Info */}
        <View style={styles.clientBox}>
          <Text style={styles.clientTitle}>Client</Text>
          <Text style={styles.clientName}>{devis.client_id?.nom}</Text>
          <Text style={styles.smallText}>{devis.client_id?.adresse}</Text>
          <Text style={styles.smallText}>
            Tél: {devis.client_id?.telephone}
          </Text>
          <Text style={styles.smallText}>Email: {devis.client_id?.email}</Text>
          <Text style={styles.smallText}>
            M.F: {devis.client_id?.matricule_fiscal}
          </Text>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.descriptionColumn}>Description</Text>
            <Text style={styles.amountColumn}>Montant (TND)</Text>
          </View>
          {devis.lignes?.map((ligne, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.descriptionColumn}>{ligne.description}</Text>
              <Text style={styles.amountColumn}>
                {formatCurrency(ligne.montant)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
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
            <Text style={styles.grandTotalLabel}>Total TTC:</Text>
            <Text style={styles.grandTotalValue}>
              {formatCurrency(devis.montant_ttc)} TND
            </Text>
          </View>

          {devis.montant_acompte > 0 && (
            <View style={styles.acompteBox}>
              <Text style={{ fontSize: 9, fontWeight: "bold" }}>
                Acompte demandé:
              </Text>
              <Text style={{ fontSize: 9, fontWeight: "bold" }}>
                {formatCurrency(devis.montant_acompte)} TND
              </Text>
            </View>
          )}
        </View>

        {/* Payment Conditions */}
        {devis.conditions_paiement && (
          <View style={styles.conditionsBox}>
            <Text style={styles.boxTitle}>Conditions de Paiement</Text>
            <Text style={styles.boxText}>{devis.conditions_paiement}</Text>
          </View>
        )}

        {/* Notes */}
        {devis.notes && (
          <View style={styles.notesBox}>
            <Text style={styles.boxTitle}>Notes</Text>
            <Text style={styles.boxText}>{devis.notes}</Text>
          </View>
        )}

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Le Prestataire</Text>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureNote}>Signature & Cachet</Text>
            </View>
          </View>

          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Le Client</Text>
            <Text style={styles.signatureNote}>(Bon pour accord)</Text>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureNote}>Signature & Date</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Document généré automatiquement - {clientInfo.nom} -{" "}
          {clientInfo.email}
        </Text>
      </Page>
    </Document>
  );
};

export default DevisPDF;
