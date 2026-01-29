import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Register fonts (optional - uses default if not available)
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.woff2', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff2', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#E8998D',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#E8998D',
    borderRadius: 8,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 700,
  },
  logoTextLet: {
    color: '#E8998D',
  },
  logoTextLog: {
    color: '#1a1a1a',
  },
  headerRight: {
    textAlign: 'right',
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 4,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 11,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
    color: '#E8998D',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  propertyInfo: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  infoLabel: {
    width: 120,
    fontWeight: 600,
    color: '#666',
  },
  infoValue: {
    flex: 1,
    color: '#1a1a1a',
  },
  roomSection: {
    marginBottom: 25,
    pageBreakInside: 'avoid',
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E8998D',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  roomName: {
    fontSize: 12,
    fontWeight: 700,
    color: '#fff',
  },
  roomCondition: {
    fontSize: 10,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '4 8',
    borderRadius: 4,
  },
  roomNotes: {
    fontSize: 10,
    color: '#666',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoContainer: {
    width: '31%',
    marginBottom: 8,
  },
  photo: {
    width: '100%',
    height: 100,
    objectFit: 'cover',
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  photoCaption: {
    fontSize: 8,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerText: {
    fontSize: 8,
    color: '#999',
  },
  pageNumber: {
    fontSize: 8,
    color: '#999',
  },
  signatureSection: {
    marginTop: 40,
    pageBreakInside: 'avoid',
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  signatureBox: {
    width: '45%',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
    marginBottom: 5,
    height: 40,
  },
  signatureLabel: {
    fontSize: 9,
    color: '#666',
  },
  disclaimer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fff9f8',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E8998D',
  },
  disclaimerText: {
    fontSize: 8,
    color: '#666',
    lineHeight: 1.5,
  },
  conditionBadge: {
    padding: '2 6',
    borderRadius: 3,
    fontSize: 8,
    fontWeight: 600,
  },
  conditionExcellent: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  conditionGood: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
  },
  conditionFair: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  conditionPoor: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
});

export interface Photo {
  id: string;
  url: string;
  caption?: string;
  timestamp: string;
}

export interface Room {
  id: string;
  name: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  notes?: string;
  photos: Photo[];
}

export interface PropertyData {
  id: string;
  address: string;
  postcode: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  landlordName: string;
  tenantName?: string;
  tenancyStartDate?: string;
  rooms: Room[];
}

export interface InventoryReportProps {
  property: PropertyData;
  reportType: 'check-in' | 'check-out' | 'interim';
  reportDate: string;
  preparedBy: string;
}

const getConditionStyle = (condition: string) => {
  switch (condition) {
    case 'excellent':
      return styles.conditionExcellent;
    case 'good':
      return styles.conditionGood;
    case 'fair':
      return styles.conditionFair;
    case 'poor':
      return styles.conditionPoor;
    default:
      return styles.conditionGood;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const getReportTitle = (type: string) => {
  switch (type) {
    case 'check-in':
      return 'Check-In Inventory Report';
    case 'check-out':
      return 'Check-Out Inventory Report';
    case 'interim':
      return 'Interim Inspection Report';
    default:
      return 'Property Inventory Report';
  }
};

export const InventoryReport: React.FC<InventoryReportProps> = ({
  property,
  reportType,
  reportDate,
  preparedBy,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logo}>
          <View style={styles.logoIcon}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>L</Text>
          </View>
          <Text style={styles.logoText}>
            <Text style={styles.logoTextLet}>Let</Text>
            <Text style={styles.logoTextLog}>Log</Text>
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.title}>{getReportTitle(reportType)}</Text>
          <Text style={styles.subtitle}>{formatDate(reportDate)}</Text>
        </View>
      </View>

      {/* Property Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Property Details</Text>
        <View style={styles.propertyInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>{property.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Postcode:</Text>
            <Text style={styles.infoValue}>{property.postcode}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Property Type:</Text>
            <Text style={styles.infoValue}>{property.propertyType}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bedrooms:</Text>
            <Text style={styles.infoValue}>{property.bedrooms}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bathrooms:</Text>
            <Text style={styles.infoValue}>{property.bathrooms}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Landlord:</Text>
            <Text style={styles.infoValue}>{property.landlordName}</Text>
          </View>
          {property.tenantName && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tenant:</Text>
              <Text style={styles.infoValue}>{property.tenantName}</Text>
            </View>
          )}
          {property.tenancyStartDate && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tenancy Start:</Text>
              <Text style={styles.infoValue}>{formatDate(property.tenancyStartDate)}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Prepared By:</Text>
            <Text style={styles.infoValue}>{preparedBy}</Text>
          </View>
        </View>
      </View>

      {/* Rooms */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Room-by-Room Inventory</Text>
        {property.rooms.map((room) => (
          <View key={room.id} style={styles.roomSection} wrap={false}>
            <View style={styles.roomHeader}>
              <Text style={styles.roomName}>{room.name}</Text>
              <Text style={[styles.conditionBadge, getConditionStyle(room.condition)]}>
                {room.condition.toUpperCase()}
              </Text>
            </View>
            {room.notes && (
              <Text style={styles.roomNotes}>{room.notes}</Text>
            )}
            {room.photos.length > 0 && (
              <View style={styles.photoGrid}>
                {room.photos.slice(0, 6).map((photo) => (
                  <View key={photo.id} style={styles.photoContainer}>
                    <Image src={photo.url} style={styles.photo} />
                    <Text style={styles.photoCaption}>
                      {photo.caption || formatDate(photo.timestamp)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer} fixed>
        <Text style={styles.footerText}>
          Generated by LetLog • {formatDate(reportDate)}
        </Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      </View>
    </Page>

    {/* Signature Page */}
    <Page size="A4" style={styles.page}>
      <View style={styles.signatureSection}>
        <Text style={styles.sectionTitle}>Declaration & Signatures</Text>
        
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            This inventory report has been prepared as an accurate record of the property condition 
            at the date of inspection. Both parties should review this document carefully and note 
            any discrepancies within 7 days of receipt. This report may be used as evidence in any 
            deposit dispute. All photographs are timestamped and geotagged for verification purposes.
          </Text>
        </View>

        <View style={styles.signatureRow}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Landlord / Agent Signature</Text>
            <Text style={styles.signatureLabel}>Name: {property.landlordName}</Text>
            <Text style={styles.signatureLabel}>Date: ________________</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Tenant Signature</Text>
            <Text style={styles.signatureLabel}>Name: {property.tenantName || '________________'}</Text>
            <Text style={styles.signatureLabel}>Date: ________________</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer} fixed>
        <Text style={styles.footerText}>
          Generated by LetLog • {formatDate(reportDate)}
        </Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      </View>
    </Page>
  </Document>
);

export default InventoryReport;
