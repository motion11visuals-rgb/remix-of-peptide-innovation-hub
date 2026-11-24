import * as React from 'react'
import { Body, Container, Head, Heading, Html, Preview, Text, Section, Hr } from '@react-email/components'
import type { TemplateEntry } from './registry'
import type { PricedLine } from '../order-logic'
import { formatPrice } from '../products'
import { ORDER_PROCESSING_LABEL } from '../store-policy'

interface Props {
  customerName?: string
  orderRef?: string
  items?: PricedLine[]
  subtotal?: number
  shipping?: number
  processingFee?: number
  total?: number
  paymentMethod?: string
  shippingAddress?: string
}

function OrderConfirmation({ customerName, orderRef, items = [], subtotal = 0, shipping = 0, processingFee = 0, total = 0, paymentMethod, shippingAddress }: Props) {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Your Synthesia Labs order {orderRef ?? ''} is received. Your shipping label will follow after review.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.brand}>Synthesia Labs</Text>
          <Heading style={styles.heading}>Order received</Heading>
          <Text>Hi {customerName || 'there'},</Text>
          <Text>Thank you for your order. Your reference is <strong>{orderRef || 'shown on your checkout confirmation'}</strong>.</Text>
          <Section style={styles.notice}>
            <Text style={styles.noticeText}>We’ll get your shipping label ready as soon as possible after payment verification and research eligibility review. Order processing takes {ORDER_PROCESSING_LABEL}; carrier transit time is additional. This email does not mean your order has shipped.</Text>
          </Section>
          <Heading as="h2" style={styles.subheading}>Order details</Heading>
          {items.map((item, index) => (
            <Text key={`${item.slug}-${item.size}-${index}`}>
              <strong>{item.name}</strong> · {item.size} × {item.qty}<br />
              {formatPrice(item.unitPrice)} each · {formatPrice(item.total)}
            </Text>
          ))}
          <Hr style={styles.rule} />
          <Text>Merchandise: {formatPrice(subtotal)}<br />Shipping: {shipping === 0 ? 'Free' : formatPrice(shipping)}<br />Processing fee: {formatPrice(processingFee)}</Text>
          <Text><strong>Total: {formatPrice(total)}</strong></Text>
          {paymentMethod && <Text>Payment method: {paymentMethod}. Your payment screenshot has been received and is pending review. This receipt does not confirm payment settlement.</Text>}
          {shippingAddress && <><Heading as="h2" style={styles.subheading}>Shipping address</Heading><Text>{shippingAddress}</Text></>}
          <Hr style={styles.rule} />
          <Text style={styles.small}>Keep your order reference for any questions. All products are for laboratory research use only. Not for human consumption.</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: OrderConfirmation,
  subject: (data: Record<string, unknown>) => `Synthesia Labs — Order received${typeof data['orderRef'] === 'string' ? ` (${data['orderRef']})` : ''}`,
  displayName: 'Order confirmation and shipping label notice',
  previewData: {
    customerName: 'Alex', orderRef: 'AU-ABCDEF',
    items: [{ slug: 'retatrutide', name: 'GLP-RT', size: '5 mg', qty: 1, unitPrice: 35, total: 35 }],
    subtotal: 35, shipping: 9, processingFee: 2, total: 46,
    paymentMethod: 'Zelle', shippingAddress: '123 Research Avenue, Miami, FL 33182',
  },
} satisfies TemplateEntry

const styles = {
  body: { backgroundColor: '#ffffff', color: '#302d26', fontFamily: 'Arial, sans-serif' },
  container: { maxWidth: '560px', padding: '32px 24px' },
  brand: { color: '#b8933a', fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 'bold' },
  heading: { fontFamily: 'Georgia, serif', fontSize: '28px' },
  subheading: { fontFamily: 'Georgia, serif', fontSize: '18px', marginTop: '24px' },
  notice: { borderLeft: '3px solid #b8933a', paddingLeft: '16px' },
  noticeText: { lineHeight: '24px' },
  rule: { borderColor: '#e9e1cf', margin: '24px 0' },
  small: { color: '#696355', fontSize: '12px', lineHeight: '20px' },
}