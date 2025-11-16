import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Simpler, cleaner devis styles - more proposal-like
const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontSize: 8,
    fontFamily: "Helvetica",
    lineHeight: 1.3,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  companyName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
  },
  companyDetail: {
    fontSize: 7,
    color: "#666666",
    marginBottom: 1,
  },
  devisBox: {
    textAlign: "right",
  },
  devisTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#333333",
    marginBottom: 20,
  },
  devisNumber: {
    fontSize: 9,
    color: "#666666",
    marginBottom: 2,
  },

  // Client Section
  clientSection: {
    marginBottom: 15,
  },
  label: {
    fontSize: 7,
    color: "#999999",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  clientName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  clientInfo: {
    fontSize: 7,
    color: "#666666",
    marginBottom: 1,
  },

  // Proposal Introduction
  introSection: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  introText: {
    fontSize: 8,
    lineHeight: 1.5,
    color: "#333333",
  },

  // Services Section (No table, just clean list)
  servicesSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  serviceItem: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  serviceName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    width: "75%",
  },
  servicePrice: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  serviceDescription: {
    fontSize: 7,
    color: "#666666",
    lineHeight: 1.3,
    marginTop: 2,
  },

  // Summary Box
  summaryBox: {
    marginTop: 10,
    marginLeft: "auto",
    width: "50%",
    padding: 12,
    backgroundColor: "#f5f5f5",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 8,
    color: "#666666",
  },
  summaryValue: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 2,
    borderTopColor: "#333333",
  },
  totalLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
  },
  totalValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  depositBox: {
    marginTop: 6,
    padding: 6,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  depositText: {
    fontSize: 7,
    textAlign: "center",
    color: "#333333",
  },

  // Terms & Conditions
  termsSection: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  termsTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  termsList: {
    fontSize: 7,
    lineHeight: 1.4,
    color: "#666666",
  },

  // Validity Notice
  validityBox: {
    marginTop: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "#cccccc",
    textAlign: "center",
  },
  validityText: {
    fontSize: 7,
    color: "#666666",
  },

  // Signature
  signatureSection: {
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
  },
  signatureText: {
    fontSize: 7,
    color: "#666666",
    marginBottom: 20,
    textAlign: "center",
  },
  signatureBoxes: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBox: {
    width: "45%",
  },
  signatureLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    marginBottom: 25,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#333333",
    paddingTop: 3,
  },
  signatureNote: {
    fontSize: 6,
    color: "#999999",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 15,
    left: 25,
    right: 25,
    fontSize: 6,
    color: "#999999",
    textAlign: "center",
  },
});

const DevisPDF = ({ devis, clientInfo }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
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
          <View>
            <Text style={styles.companyName}>{clientInfo.nom}</Text>
            <Text style={styles.companyDetail}>{clientInfo.adresse}</Text>
            <Text style={styles.companyDetail}>
              Tél: {clientInfo.telephone}
            </Text>
            <Text style={styles.companyDetail}>Email: {clientInfo.email}</Text>
            <Text style={styles.companyDetail}>
              M.F: {clientInfo.matricule_fiscal}
            </Text>
          </View>

          <View style={styles.devisBox}>
            <Text style={styles.devisTitle}>DEVIS</Text>
            <Text style={styles.devisNumber}>N° {devis.numero}</Text>
            <Text style={styles.devisNumber}>
              {formatDate(devis.date_emission)}
            </Text>
          </View>
        </View>

        {/* Client */}
        <View style={styles.clientSection}>
          <Text style={styles.label}>Devis établi pour</Text>
          <Text style={styles.clientName}>{devis.client_id?.nom}</Text>
          <Text style={styles.clientInfo}>{devis.client_id?.adresse}</Text>
          <Text style={styles.clientInfo}>{devis.client_id?.email}</Text>
          <Text style={styles.clientInfo}>
            Tél: {devis.client_id?.telephone}
          </Text>
        </View>

        {/* Introduction (Optional) */}
        <View style={styles.introSection}>
          <Text style={styles.introText}>
            Suite à votre demande, nous avons le plaisir de vous proposer notre
            offre pour la réalisation de votre projet. Ce devis détaille
            l'ensemble des prestations et leur tarification.
          </Text>
        </View>

        {/* Services - Clean List Format */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Prestations Proposées</Text>

          {devis.lignes?.map((ligne, index) => (
            <View key={index} style={styles.serviceItem}>
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceName}>
                  {index + 1}. {ligne.description.split("-")[0].trim()}
                </Text>
                <Text style={styles.servicePrice}>
                  {formatCurrency(ligne.montant)} TND
                </Text>
              </View>
              {ligne.description.includes("-") && (
                <Text style={styles.serviceDescription}>
                  {ligne.description.split("-").slice(1).join("-").trim()}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sous-total HT</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(devis.montant_ht)} TND
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>TVA ({devis.tva}%)</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency((devis.montant_ht * devis.tva) / 100)} TND
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Timbre Fiscal</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(devis.timbre_fiscal)} TND
            </Text>
          </View>

          <View style={styles.summaryTotal}>
            <Text style={styles.totalLabel}>MONTANT TOTAL</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(devis.montant_ttc)} TND
            </Text>
          </View>

          {devis.montant_acompte > 0 && (
            <View style={styles.depositBox}>
              <Text style={styles.depositText}>
                Acompte requis: {formatCurrency(devis.montant_acompte)} TND (
                {((devis.montant_acompte / devis.montant_ttc) * 100).toFixed(0)}
                %)
              </Text>
            </View>
          )}
        </View>

        {/* Terms */}
        {devis.conditions_paiement && (
          <View style={styles.termsSection}>
            <Text style={styles.termsTitle}>Conditions de Paiement</Text>
            <Text style={styles.termsList}>{devis.conditions_paiement}</Text>
          </View>
        )}

        {/* Notes */}
        {devis.notes && (
          <View style={styles.termsSection}>
            <Text style={styles.termsTitle}>Informations Complémentaires</Text>
            <Text style={styles.termsList}>{devis.notes}</Text>
          </View>
        )}

        {/* Validity */}
        <View style={styles.validityBox}>
          <Text style={styles.validityText}>
            Ce devis est valable jusqu'au {formatDate(devis.date_validite)}
          </Text>
        </View>

        {/* Signature */}
        <View style={styles.signatureSection}>
          <Text style={styles.signatureText}>
            Pour acceptation, merci de retourner ce devis signé et daté
          </Text>

          <View style={styles.signatureBoxes}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>Le Prestataire</Text>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureNote}>Signature</Text>
              </View>
            </View>

            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>
                Le Client (Bon pour accord)
              </Text>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureNote}>Date et Signature</Text>
              </View>
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
