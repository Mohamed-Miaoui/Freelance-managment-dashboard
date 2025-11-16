import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Optimized styles to fit on one page
const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontSize: 8,
    fontFamily: "Helvetica",
    lineHeight: 1.2,
  },
  // Header Section
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
  },
  companyInfo: {
    width: "50%",
  },
  companyName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  companyDetails: {
    fontSize: 7,
    color: "#333333",
    marginBottom: 1,
  },
  factureSection: {
    width: "45%",
    textAlign: "right",
  },
  factureTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    marginBottom: 20,
    letterSpacing: 1.5,
  },
  factureNumber: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  dateText: {
    fontSize: 7,
    color: "#333333",
    marginBottom: 1,
  },
  statusBox: {
    marginTop: 3,
    padding: 3,
    borderWidth: 2,
    borderColor: "#000000",
    textAlign: "center",
  },
  statusText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },

  // Client Section
  clientSection: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#f8f8f8",
    borderLeftWidth: 3,
    borderLeftColor: "#000000",
  },
  sectionTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  clientName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  clientDetail: {
    fontSize: 7,
    color: "#333333",
    marginBottom: 1,
  },

  // Reference section
  referenceBox: {
    marginBottom: 10,
    padding: 5,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  referenceText: {
    fontSize: 7,
    color: "#333333",
  },

  // Table
  table: {
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
    paddingVertical: 4,
    backgroundColor: "#f0f0f0",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#cccccc",
    paddingVertical: 4,
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
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  tableCellText: {
    fontSize: 7,
  },
  tableCellAmount: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
  },

  // Totals
  totalsSection: {
    marginLeft: "auto",
    width: "45%",
    marginBottom: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: "#cccccc",
  },
  totalLabel: {
    fontSize: 7,
    color: "#333333",
  },
  totalValue: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    marginTop: 3,
    backgroundColor: "#000000",
    color: "#ffffff",
    paddingHorizontal: 8,
  },
  grandTotalLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  grandTotalValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  soldeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    marginTop: 2,
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: "#000000",
    backgroundColor: "#f8f8f8",
  },
  soldeText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },

  // Payment section - COMPACT
  paiementsSection: {
    marginBottom: 8,
    padding: 6,
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  paiementTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 2,
  },
  paiementRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
    fontSize: 7,
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

  // Conditions & Notes - COMPACT
  infoBox: {
    marginBottom: 6,
    padding: 6,
    backgroundColor: "#f8f8f8",
    borderLeftWidth: 2,
    borderLeftColor: "#000000",
  },
  infoTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 6,
    lineHeight: 1.3,
    color: "#333333",
  },

  // Important notice box - COMPACT
  noticeBox: {
    marginBottom: 8,
    padding: 6,
    borderWidth: 2,
    borderColor: "#000000",
    backgroundColor: "#ffffff",
  },
  noticeText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },

  // Stamp section - COMPACT
  stampSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 6,
    paddingTop: 6,
  },
  stampBox: {
    width: "35%",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#000000",
    padding: 5,
  },
  stampLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    marginBottom: 15,
  },
  stampNote: {
    fontSize: 6,
    color: "#666666",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 15,
    left: 25,
    right: 25,
    textAlign: "center",
    fontSize: 6,
    color: "#999999",
    borderTopWidth: 0.5,
    borderTopColor: "#cccccc",
    paddingTop: 4,
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
  const showPaymentHistory = facture.paiements && facture.paiements.length > 0;
  const showConditions =
    facture.conditions_paiement &&
    facture.conditions_paiement.trim().length > 0;
  const showNotes = facture.notes && facture.notes.trim().length > 0;

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

        {/* Reference to Devis */}
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

        {/* Payment History - Only if payments exist */}
        {showPaymentHistory && (
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

        {/* Payment Conditions - Only if exists and not empty */}
        {showConditions && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Conditions de Paiement</Text>
            <Text style={styles.infoText}>{facture.conditions_paiement}</Text>
          </View>
        )}

        {/* Notes - Only if exists and not empty */}
        {showNotes && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Notes</Text>
            <Text style={styles.infoText}>{facture.notes}</Text>
          </View>
        )}

        {/* Payment Notice - Only if unpaid */}
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
