import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Professional black & white styles for invoice
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
  factureSection: {
    width: "45%",
    textAlign: "right",
  },
  factureTitle: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    marginBottom: 20,
    letterSpacing: 1.5,
  },
  factureNumber: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 8,
    color: "#333333",
    marginBottom: 1,
  },
  statusBox: {
    marginTop: 5,
    padding: 5,
    borderWidth: 2,
    borderColor: "#000000",
    textAlign: "center",
  },
  statusText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
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

  // Reference section (if from devis)
  referenceBox: {
    marginBottom: 15,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  referenceText: {
    fontSize: 8,
    color: "#333333",
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
  soldeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    marginTop: 3,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderColor: "#000000",
    backgroundColor: "#f8f8f8",
  },
  soldeText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },

  // Payment section
  paiementsSection: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  paiementTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 3,
  },
  paiementRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    fontSize: 8,
  },
  paiementDate: {
    width: "25%",
  },
  paiementMode: {
    width: "25%",
  },
  paiementRef: {
    width: "25%",
  },
  paiementAmount: {
    width: "25%",
    textAlign: "right",
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

  // Important notice box
  noticeBox: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 2,
    borderColor: "#000000",
    backgroundColor: "#ffffff",
  },
  noticeText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
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

  // Stamp section
  stampSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    paddingTop: 10,
  },
  stampBox: {
    width: "40%",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#000000",
    padding: 8,
  },
  stampLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    marginBottom: 25,
  },
  stampNote: {
    fontSize: 7,
    color: "#666666",
  },
});

const FacturePDF = ({ facture, clientInfo }) => {
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

  const getStatusLabel = (status) => {
    switch (status) {
      case "en_attente":
        return "EN ATTENTE DE PAIEMENT";
      case "payee":
        return "PAYÉE";
      case "en_retard":
        return "EN RETARD";
      default:
        return status.toUpperCase();
    }
  };

  const totalPaiements =
    facture.paiements?.reduce((sum, p) => sum + p.montant, 0) || 0;

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

          <View style={styles.factureSection}>
            <Text style={styles.factureTitle}>FACTURE</Text>
            <Text style={styles.factureNumber}>N° {facture.numero}</Text>
            <Text style={styles.dateText}>
              Date: {formatDate(facture.date_emission)}
            </Text>
            <Text style={styles.dateText}>
              Échéance: {formatDate(facture.date_echeance)}
            </Text>
            <View style={styles.statusBox}>
              <Text style={styles.statusText}>
                {getStatusLabel(facture.statut)}
              </Text>
            </View>
          </View>
        </View>

        {/* Reference to Devis if exists */}
        {facture.devis_id && (
          <View style={styles.referenceBox}>
            <Text style={styles.referenceText}>
              Référence: Devis N° {facture.devis_id.numero || facture.devis_id}
            </Text>
          </View>
        )}

        {/* Client Info */}
        <View style={styles.clientSection}>
          <Text style={styles.sectionTitle}>Facturé à</Text>
          <Text style={styles.clientName}>{facture.client_id?.nom}</Text>
          <Text style={styles.clientDetail}>{facture.client_id?.adresse}</Text>
          <Text style={styles.clientDetail}>
            Tél: {facture.client_id?.telephone}
          </Text>
          <Text style={styles.clientDetail}>
            Email: {facture.client_id?.email}
          </Text>
          <Text style={styles.clientDetail}>
            M.F: {facture.client_id?.matricule_fiscal}
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
          {facture.lignes?.map((ligne, index) => (
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
              {formatCurrency(facture.montant_ht)} TND
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TVA ({facture.tva}%):</Text>
            <Text style={styles.totalValue}>
              {formatCurrency((facture.montant_ht * facture.tva) / 100)} TND
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Timbre Fiscal:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(facture.timbre_fiscal)} TND
            </Text>
          </View>

          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>MONTANT TOTAL TTC</Text>
            <Text style={styles.grandTotalValue}>
              {formatCurrency(facture.montant_ttc)} TND
            </Text>
          </View>

          {facture.acompte > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Acompte versé:</Text>
              <Text style={styles.totalValue}>
                - {formatCurrency(facture.acompte)} TND
              </Text>
            </View>
          )}

          {totalPaiements > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Paiements reçus:</Text>
              <Text style={styles.totalValue}>
                - {formatCurrency(totalPaiements)} TND
              </Text>
            </View>
          )}

          <View style={styles.soldeRow}>
            <Text style={styles.soldeText}>
              {facture.solde_a_payer > 0 ? "SOLDE À PAYER" : "SOLDÉE"}
            </Text>
            <Text style={styles.soldeText}>
              {formatCurrency(facture.solde_a_payer || 0)} TND
            </Text>
          </View>
        </View>

        {/* Payment History */}
        {facture.paiements && facture.paiements.length > 0 && (
          <View style={styles.paiementsSection}>
            <Text style={styles.paiementTitle}>Historique des paiements</Text>
            <View style={styles.paiementRow}>
              <Text
                style={[styles.paiementDate, { fontFamily: "Helvetica-Bold" }]}
              >
                Date
              </Text>
              <Text
                style={[styles.paiementMode, { fontFamily: "Helvetica-Bold" }]}
              >
                Mode
              </Text>
              <Text
                style={[styles.paiementRef, { fontFamily: "Helvetica-Bold" }]}
              >
                Référence
              </Text>
              <Text
                style={[
                  styles.paiementAmount,
                  { fontFamily: "Helvetica-Bold" },
                ]}
              >
                Montant
              </Text>
            </View>
            {facture.paiements.map((paiement, index) => (
              <View key={index} style={styles.paiementRow}>
                <Text style={styles.paiementDate}>
                  {formatDate(paiement.date_paiement)}
                </Text>
                <Text style={styles.paiementMode}>
                  {paiement.mode_paiement}
                </Text>
                <Text style={styles.paiementRef}>
                  {paiement.reference || "-"}
                </Text>
                <Text style={styles.paiementAmount}>
                  {formatCurrency(paiement.montant)} TND
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Payment Conditions */}
        {facture.conditions_paiement && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Conditions de Paiement</Text>
            <Text style={styles.infoText}>{facture.conditions_paiement}</Text>
          </View>
        )}

        {/* Notes */}
        {facture.notes && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Notes</Text>
            <Text style={styles.infoText}>{facture.notes}</Text>
          </View>
        )}

        {/* Payment Notice */}
        {facture.solde_a_payer > 0 && (
          <View style={styles.noticeBox}>
            <Text style={styles.noticeText}>
              Merci de régler cette facture avant le{" "}
              {formatDate(facture.date_echeance)}
            </Text>
          </View>
        )}

        {/* Stamp Section */}
        <View style={styles.stampSection}>
          <View style={styles.stampBox}>
            <Text style={styles.stampLabel}>CACHET ET SIGNATURE</Text>
            <Text style={styles.stampNote}>Le Prestataire</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          {clientInfo.nom} • {clientInfo.email} • {clientInfo.telephone} • M.F:{" "}
          {clientInfo.matricule_fiscal}
        </Text>
      </Page>
    </Document>
  );
};

export default FacturePDF;
