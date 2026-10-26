import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SidebarDock } from '../../src/components/SidebarDock/SidebarDock';
import { CustomNode } from '../../src/components/CustomNode/CustomNode';
import { Inspector } from '../../src/components/Inspector/Inspector';
import { useGraphStore, CustomNodeType } from '../../src/state/graphStore';
import { calculateSimulationTick } from '../../src/simulation/engineMath';
import { ReactFlowProvider, Edge } from '@xyflow/react';

describe('S-015 Cloud Empires (Freestyle, AWS, Azure, GCP) Unit Tests', () => {
  it('renders all 4 Cloud Empire tabs in SidebarDock and switches catalogs on click', () => {
    render(<SidebarDock />);

    // 1. Verify tabs exist
    const freestyleTab = screen.getByRole('tab', { name: /freestyle/i });
    const awsTab = screen.getByRole('tab', { name: /aws/i });
    const azureTab = screen.getByRole('tab', { name: /azure/i });
    const gcpTab = screen.getByRole('tab', { name: /gcp/i });

    expect(freestyleTab).toBeInTheDocument();
    expect(awsTab).toBeInTheDocument();
    expect(azureTab).toBeInTheDocument();
    expect(gcpTab).toBeInTheDocument();

    // Default is Freestyle
    expect(screen.getByText('PostgreSQL DB')).toBeInTheDocument();

    // 2. Switch to AWS
    fireEvent.click(awsTab);
    expect(screen.getByText('AWS Application Load Balancer')).toBeInTheDocument();
    expect(screen.getByText('AWS EC2 (t4g.large)')).toBeInTheDocument();
    expect(screen.getByText('AWS ElastiCache (Redis)')).toBeInTheDocument();
    expect(screen.getByText('Amazon Aurora / RDS PG')).toBeInTheDocument();
    expect(screen.getByText('AWS DynamoDB (NoSQL)')).toBeInTheDocument();
    expect(screen.getByText('AWS SQS (Standard/FIFO)')).toBeInTheDocument();

    // 3. Switch to Azure
    fireEvent.click(azureTab);
    expect(screen.getByText('Azure Application Gateway')).toBeInTheDocument();
    expect(screen.getByText('Azure VM (B2ms)')).toBeInTheDocument();
    expect(screen.getByText('Azure Cache for Redis')).toBeInTheDocument();
    expect(screen.getByText('Azure Database for PostgreSQL')).toBeInTheDocument();
    expect(screen.getByText('Azure Cosmos DB')).toBeInTheDocument();
    expect(screen.getByText('Azure Service Bus')).toBeInTheDocument();

    // 4. Switch to GCP
    fireEvent.click(gcpTab);
    expect(screen.getByText('GCP Cloud Load Balancer')).toBeInTheDocument();
    expect(screen.getByText('GCP Cloud Run / Compute')).toBeInTheDocument();
    expect(screen.getByText('GCP Cloud Memorystore')).toBeInTheDocument();
    expect(screen.getByText('GCP Cloud SQL (PostgreSQL)')).toBeInTheDocument();
    expect(screen.getByText('GCP Cloud Spanner')).toBeInTheDocument();
    expect(screen.getByText('GCP Cloud Pub/Sub')).toBeInTheDocument();
  });

  it('renders provider badges (AWS, AZURE, GCP, FOSS) on CustomNode headers', () => {
    // AWS node
    const awsNodeProps = {
      id: 'node-aws-ec2',
      type: 'custom',
      selected: false,
      zIndex: 1,
      isConnectable: true,
      xPos: 0,
      yPos: 0,
      dragging: false,
      data: {
        name: 'AWS EC2 (t4g.large)',
        category: 'compute' as const,
        cost: 48,
        capacityRps: 1500,
        addedLatencyMs: 15,
        icon: 'Cpu',
        status: 'healthy' as const,
        currentRps: 600,
        provider: 'aws' as const,
      },
    };

    const { rerender } = render(
      <ReactFlowProvider>
        <CustomNode {...awsNodeProps} />
      </ReactFlowProvider>
    );

    expect(screen.getByText('AWS EC2 (t4g.large)')).toBeInTheDocument();
    expect(screen.getByText('AWS')).toBeInTheDocument();

    // GCP node
    const gcpNodeProps = {
      ...awsNodeProps,
      id: 'node-gcp-spanner',
      data: {
        name: 'GCP Cloud Spanner',
        category: 'storage' as const,
        cost: 200,
        capacityRps: 15000,
        addedLatencyMs: 6,
        icon: 'Database',
        status: 'healthy' as const,
        currentRps: 3000,
        provider: 'gcp' as const,
      },
    };

    rerender(
      <ReactFlowProvider>
        <CustomNode {...gcpNodeProps} />
      </ReactFlowProvider>
    );

    expect(screen.getByText('GCP Cloud Spanner')).toBeInTheDocument();
    expect(screen.getByText('GCP')).toBeInTheDocument();
  });

  it('renders provider badge in Inspector panel for selected node', () => {
    useGraphStore.setState({
      nodes: [
        {
          id: 'test-azure-appgw',
          type: 'custom',
          position: { x: 0, y: 0 },
          data: {
            name: 'Azure Application Gateway',
            category: 'routing',
            cost: 35,
            capacityRps: 20000,
            addedLatencyMs: 3,
            icon: 'Network',
            status: 'healthy',
            currentRps: 1200,
            provider: 'azure',
            description: 'L7 Web Traffic Load Balancer với SSL Offloading',
          },
        },
      ],
      selectedNodeId: 'test-azure-appgw',
    });

    render(<Inspector />);

    expect(screen.getByText('Azure Application Gateway')).toBeInTheDocument();
    expect(screen.getByText('Azure')).toBeInTheDocument();
    expect(screen.getByText(/\$35/)).toBeInTheDocument();
  });

  it('simulates traffic calculation for AWS ecosystem (ALB -> EC2 -> ElastiCache -> Aurora)', () => {
    const nodes: CustomNodeType[] = [
      {
        id: 'client-aws',
        type: 'custom',
        position: { x: 0, y: 0 },
        data: {
          name: 'User Traffic',
          category: 'routing',
          cost: 0,
          capacityRps: 10000,
          addedLatencyMs: 0,
          icon: 'Users',
          status: 'healthy',
          currentRps: 0,
          provider: 'aws',
        },
      },
      {
        id: 'alb-1',
        type: 'custom',
        position: { x: 100, y: 0 },
        data: {
          name: 'AWS Application Load Balancer',
          category: 'routing',
          cost: 25,
          capacityRps: 20000,
          addedLatencyMs: 3,
          icon: 'Network',
          status: 'healthy',
          currentRps: 0,
          provider: 'aws',
        },
      },
      {
        id: 'ec2-1',
        type: 'custom',
        position: { x: 200, y: 0 },
        data: {
          name: 'AWS EC2 (t4g.large)',
          category: 'compute',
          cost: 48,
          capacityRps: 1500,
          addedLatencyMs: 15,
          icon: 'Cpu',
          status: 'healthy',
          currentRps: 0,
          provider: 'aws',
        },
      },
      {
        id: 'elasticache-1',
        type: 'custom',
        position: { x: 300, y: 0 },
        data: {
          name: 'AWS ElastiCache (Redis)',
          category: 'storage',
          cost: 85,
          capacityRps: 25000,
          addedLatencyMs: 1,
          icon: 'Database',
          status: 'healthy',
          currentRps: 0,
          provider: 'aws',
        },
      },
      {
        id: 'aurora-1',
        type: 'custom',
        position: { x: 400, y: 0 },
        data: {
          name: 'Amazon Aurora / RDS PG',
          category: 'storage',
          cost: 120,
          capacityRps: 4000,
          addedLatencyMs: 10,
          icon: 'Database',
          status: 'healthy',
          currentRps: 0,
          provider: 'aws',
        },
      },
    ];

    const edges: Edge[] = [
      { id: 'e1', source: 'client-aws', target: 'alb-1' },
      { id: 'e2', source: 'alb-1', target: 'ec2-1' },
      { id: 'e3', source: 'ec2-1', target: 'elasticache-1' },
      { id: 'e4', source: 'elasticache-1', target: 'aurora-1' },
    ];

    const result = calculateSimulationTick(
      nodes,
      edges,
      1000, // trafficRps: 1000 RPS
      500,  // budgetLimit: $500
      0.2   // writeRatio: 20%
    );

    // 1. Check ALB gets 1000 RPS
    expect(result.nodeUpdates['alb-1'].currentRps).toBe(1000);
    // 2. EC2 gets 1000 RPS (well within 1500 capacity)
    expect(result.nodeUpdates['ec2-1'].currentRps).toBe(1000);
    expect(result.nodeUpdates['ec2-1'].status).toBe('healthy');
    // 3. ElastiCache receives 1000 RPS (800 reads + 200 writes)
    expect(result.nodeUpdates['elasticache-1'].currentRps).toBe(1000);
    // 4. Aurora PostgreSQL gets 80 cache misses + 200 writes = 280 RPS
    expect(result.nodeUpdates['aurora-1'].currentRps).toBe(280);
    expect(result.nodeUpdates['aurora-1'].status).toBe('healthy');

    // 5. Overall metrics
    expect(result.metrics.errorRate).toBe(0);
    expect(result.metrics.throughputRps).toBe(1000);
    expect(result.metrics.costPerMonth).toBe(25 + 48 + 85 + 120); // $278/m
  });

  it('simulates traffic calculation for GCP ecosystem (Cloud LB -> Cloud Run -> Memorystore -> Cloud Spanner)', () => {
    const nodes: CustomNodeType[] = [
      {
        id: 'client-gcp',
        type: 'custom',
        position: { x: 0, y: 0 },
        data: {
          name: 'User Traffic',
          category: 'routing',
          cost: 0,
          capacityRps: 25000,
          addedLatencyMs: 0,
          icon: 'Users',
          status: 'healthy',
          currentRps: 0,
          provider: 'gcp',
        },
      },
      {
        id: 'gcp-lb-1',
        type: 'custom',
        position: { x: 100, y: 0 },
        data: {
          name: 'GCP Cloud Load Balancer',
          category: 'routing',
          cost: 22,
          capacityRps: 25000,
          addedLatencyMs: 2,
          icon: 'Network',
          status: 'healthy',
          currentRps: 0,
          provider: 'gcp',
        },
      },
      {
        id: 'gcp-run-1',
        type: 'custom',
        position: { x: 200, y: 0 },
        data: {
          name: 'GCP Cloud Run / Compute',
          category: 'compute',
          cost: 40,
          capacityRps: 3000,
          addedLatencyMs: 15,
          icon: 'Cpu',
          status: 'healthy',
          currentRps: 0,
          provider: 'gcp',
        },
      },
      {
        id: 'gcp-memo-1',
        type: 'custom',
        position: { x: 300, y: 0 },
        data: {
          name: 'GCP Cloud Memorystore',
          category: 'storage',
          cost: 50,
          capacityRps: 35000,
          addedLatencyMs: 2,
          icon: 'Database',
          status: 'healthy',
          currentRps: 0,
          provider: 'gcp',
        },
      },
      {
        id: 'gcp-spanner-1',
        type: 'custom',
        position: { x: 400, y: 0 },
        data: {
          name: 'GCP Cloud Spanner',
          category: 'storage',
          cost: 200,
          capacityRps: 15000,
          addedLatencyMs: 6,
          icon: 'Database',
          status: 'healthy',
          currentRps: 0,
          provider: 'gcp',
        },
      },
    ];

    const edges: Edge[] = [
      { id: 'ge1', source: 'client-gcp', target: 'gcp-lb-1' },
      { id: 'ge2', source: 'gcp-lb-1', target: 'gcp-run-1' },
      { id: 'ge3', source: 'gcp-run-1', target: 'gcp-memo-1' },
      { id: 'ge4', source: 'gcp-memo-1', target: 'gcp-spanner-1' },
    ];

    const result = calculateSimulationTick(
      nodes,
      edges,
      2000, // trafficRps: 2000 RPS
      600,  // budgetLimit: $600
      0.3   // writeRatio: 30%
    );

    expect(result.nodeUpdates['gcp-lb-1'].currentRps).toBe(2000);
    expect(result.nodeUpdates['gcp-run-1'].currentRps).toBe(2000);
    expect(result.nodeUpdates['gcp-run-1'].status).toBe('healthy');
    // Memorystore receives 2000 RPS
    expect(result.nodeUpdates['gcp-memo-1'].currentRps).toBe(2000);
    // Read RPS: 2000 * 0.7 = 1400. Hits = 1400 * 0.9 = 1260. Misses = 140.
    // Spanner receives 140 misses + 600 writes = 740 RPS.
    expect(result.nodeUpdates['gcp-spanner-1'].currentRps).toBe(740);
    expect(result.nodeUpdates['gcp-spanner-1'].status).toBe('healthy');

    expect(result.metrics.errorRate).toBe(0);
    expect(result.metrics.throughputRps).toBe(2000);
    expect(result.metrics.costPerMonth).toBe(22 + 40 + 50 + 200); // $312/m
  });
});
