// pages/orders.js
import { useEffect, useState, useMemo } from 'react';
import Layout from '../components/Layout';
import woocommerce from '../lib/woocommerce';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from '@nextui-org/react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = localStorage.getItem('user_id');
      const password = localStorage.getItem('password');

      if (!userId || !password) {
        setError('Not authenticated');
        return;
      }

      try {
        console.log('Fetching customer data...');
        const customerResponse = await woocommerce.get(`customers/${userId}`);

        if (!customerResponse.data) throw new Error('Failed to fetch customer');
        console.log('Customer data:', customerResponse.data);

        const customer = customerResponse.data;

        console.log('Fetching orders data...');
        const ordersResponse = await woocommerce.get(`orders?customer=${customer.id}`);

        if (!ordersResponse.data) throw new Error('Failed to fetch orders');
        console.log('Orders data:', ordersResponse.data);

        const ordersWithReceipts = await Promise.all(
          ordersResponse.data.map(async (order) => {
            if (order.payment_method === 'stripe' && order.transaction_id) {
              console.log('Fetching Stripe receipt for order:', order.id);
              const response = await fetch('/api/fetch-stripe-receipt', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ paymentIntentId: order.transaction_id }),
              });

              if (!response.ok) throw new Error('Failed to fetch Stripe receipt');

              const { receiptUrl } = await response.json();
              console.log('Fetched Stripe receipt URL:', receiptUrl);
              return { ...order, receipt_url: receiptUrl };
            }
            return order;
          })
        );

        console.log('Orders with receipts:', ordersWithReceipts);
        setOrders(ordersWithReceipts);
      } catch (err) {
        setError('Failed to fetch orders');
        console.log('Error fetching orders:', err.message);
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    {
      key: 'id',
      label: 'Order ID',
    },
    {
      key: 'total',
      label: 'Total',
    },
    {
      key: 'receipt',
      label: 'Receipt',
    },
  ];

  const rows = orders.map(order => ({
    key: order.id,
    id: order.id,
    total: `$${order.total}`,
    receipt: order.receipt_url ? (
      <a
        href={order.receipt_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        View Receipt
      </a>
    ) : (
      'No receipt available'
    ),
  }));

  const pages = Math.ceil(rows.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return rows.slice(start, end);
  }, [page, rows]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">Order History</h1>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <Table
            aria-label="Order History Table"
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="secondary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            }
            classNames={{
              wrapper: "min-h-[222px]",
            }}
          >
            <TableHeader columns={columns}>
              {(column) => <TableColumn key={column.key} align="center">{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={items}>
              {(item) => (
                <TableRow key={item.key}>
                  {(columnKey) => <TableCell>{item[columnKey]}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
