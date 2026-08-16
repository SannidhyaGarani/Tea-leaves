import React from 'react';
import PageHeader from '../components/Home/PageHeader';

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-[#faf9f5] text-zinc-900">
      <PageHeader
        title="Terms & Conditions"
        subtitle="Please read our terms of service carefully before using our tea store services."
        breadcrumbItems={[{ label: 'Home', path: '/' }, { label: 'Terms & Conditions' }]}
      />

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-20 space-y-12">
        {/* Intro */}
        <section className="space-y-4">
          <h2 className="text-xl font-light uppercase tracking-widest text-[#b8860b]">
            1. Overview & Agreement
          </h2>
          <p className="text-xs md:text-sm text-zinc-600 leading-relaxed">
            Welcome to Vaarta Chai. By accessing or browsing our digital platform, placing an order, or utilizing any of our tea services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you should discontinue use of our platform immediately.
          </p>
        </section>

        {/* Intellectual Property */}
        <section className="space-y-4 border-t border-zinc-200 pt-8">
          <h2 className="text-xl font-light uppercase tracking-widest text-[#b8860b]">
            2. Intellectual Property Rights
          </h2>
          <p className="text-xs md:text-sm text-zinc-600 leading-relaxed">
            All content published on this site—including but not limited to brand typography, trademarks, imagery, tea blends, product packaging, graphics, and software—is the exclusive intellectual property of Vaarta Chai and is protected by international copyright and trademark laws. Unauthorized reproduction or redistribution is strictly prohibited.
          </p>
        </section>

        {/* Orders & Pricing */}
        <section className="space-y-4 border-t border-zinc-200 pt-8">
          <h2 className="text-xl font-light uppercase tracking-widest text-[#b8860b]">
            3. Orders, Pricing & Product Availability
          </h2>
          <p className="text-xs md:text-sm text-zinc-600 leading-relaxed">
            All prices listed on our platform are displayed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to modify prices, modify product offerings, or limit order quantities at any time without prior notice.
          </p>
          <p className="text-xs md:text-sm text-zinc-600 leading-relaxed">
            Receipt of an order confirmation does not signify our final acceptance of your order. We reserve the right to cancel or refuse any order due to inventory discrepancies, suspected fraudulent activity, or pricing errors.
          </p>
        </section>

        {/* Shipping & Delivery */}
        <section className="space-y-4 border-t border-zinc-200 pt-8">
          <h2 className="text-xl font-light uppercase tracking-widest text-[#b8860b]">
            4. Shipping, Delivery & Transit
          </h2>
          <p className="text-xs md:text-sm text-zinc-600 leading-relaxed">
            We strive to dispatch all orders within 24 to 48 working hours. Estimated delivery timelines (typically 3 to 5 business days) are approximate and may vary based on courier performance or remote region transit times. Vaarta Chai is not liable for delay caused by natural events or logistics disruptions beyond our control.
          </p>
        </section>

        {/* Returns & Refunds */}
        <section className="space-y-4 border-t border-zinc-200 pt-8">
          <h2 className="text-xl font-light uppercase tracking-widest text-[#b8860b]">
            5. Freshness Guarantee & Refunds
          </h2>
          <p className="text-xs md:text-sm text-zinc-600 leading-relaxed">
            We stand by the garden-fresh quality of our tea blends. If you receive a damaged package or incorrect item, please notify us within 7 days of delivery for a prompt replacement or resolution.
          </p>
        </section>

        {/* User Obligations */}
        <section className="space-y-4 border-t border-zinc-200 pt-8">
          <h2 className="text-xl font-light uppercase tracking-widest text-[#b8860b]">
            6. Governing Law & Contact
          </h2>
          <p className="text-xs md:text-sm text-zinc-600 leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of India. For any inquiries regarding our terms, please contact our support team at <span className="text-zinc-900 font-bold">support@vartachai.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsConditions;
