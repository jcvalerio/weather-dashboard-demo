import { NextResponse } from 'next/server';
import { energyService } from '@/lib/api/energy-api';

export async function GET() {
  try {
    const energyData = await energyService.getEnergyData();
    return NextResponse.json(energyData);
  } catch (error) {
    console.error('Energy API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch energy data' },
      { status: 500 }
    );
  }
}