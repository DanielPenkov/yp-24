import React from 'react';

const YpStringFormatter = ({ amount, identifier }: {
    amount: any;
    identifier: string;

}) => {
    if (isNaN(amount)) {
        return (
            <span>
                {amount}
            </span>
        );
    }

    if ((identifier === 'Mortgage' || identifier === 'Savings' || identifier === 'finance')) {
        return  <span>
            {
                new Intl.NumberFormat('bg-BG', {
                    style: 'currency',
                    currency: "BGN"
                }).format(amount)
            }
        </span>
    }

    return (
        <span>
            {new Intl.NumberFormat().format(amount)}
        </span>
    );
};

export default YpStringFormatter;