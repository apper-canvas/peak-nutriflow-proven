import React from 'react';
import MetricCard from '@/components/molecules/MetricCard';
import { format } from 'date-fns';

const HealthSummaryCards = ({ metrics }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
                iconName="Scale"
                iconBgColor="bg-primary/10"
                iconTextColor="text-primary"
                title="Current Weight"
                value={metrics.length > 0 ? `${metrics[0].weight} kg` : '--'}
                description={metrics.length > 0 ? `Last updated ${format(new Date(metrics[0].date), 'MMM dd, yyyy')}` : 'No data yet'}
            />

            <MetricCard
                iconName="TrendingUp"
                iconBgColor="bg-secondary/10"
                iconTextColor="text-secondary"
                title="Weight Goal"
                value="70 kg"
                description="Target weight"
            />

            <MetricCard
                iconName="Target"
                iconBgColor="bg-accent/10"
                iconTextColor="text-accent"
                title="Progress"
                value={metrics.length >= 2 ? `${(metrics[1].weight - metrics[0].weight).toFixed(1)} kg` : '--'}
                description="This week"
                descriptionClassName="text-success" // Custom class for description
            />
        </div>
    );
};

export default HealthSummaryCards;