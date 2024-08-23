import React from 'react';
import Layout from './layout';
import Table from '../components/Table';


const Page: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4">
    
        <Table />
        
      </div>
    </Layout>
  );
};

export default Page;
