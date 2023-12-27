interface MonthlyData {
  fromNumberOfMonthlyPayments: string;
  maxNumberOfMonthlyPayments: string;
  fromValueOfMonthlyPayments: string;
  maxValueOfMonthlyPayments: string;
}

interface SingleData {
  fromValueOfSinglePayment: string;
  maxValueOfSinglePayment: string;
}

type TieringItem = {
  paymentsTier: boolean;
  paymentsTieringMethod: string;
  invoiceFeeMethod: string;
  invoiceAmount: string;
  invoiceCurrency: string;
  liftingFeeMethod: string;
  liftingFeeAmount: string;
  monthly: MonthlyData;
  single: SingleData;
  isFinalTier: boolean;
  paymentsTieringActive: boolean;
};

export default TieringItem;
