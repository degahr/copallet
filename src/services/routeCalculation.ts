export interface RouteCalculation {
  distance: number; // in kilometers
  duration: number; // in minutes
  routeType: 'road' | 'ferry' | 'combined';
  waypoints: Array<{
    lat: number;
    lng: number;
    type: 'pickup' | 'delivery' | 'waypoint';
  }>;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export class RouteCalculationService {
  private static readonly EARTH_RADIUS_KM = 6371;
  private static readonly ROAD_DETOUR_FACTOR = 1.3; // Roads are typically 30% longer than direct distance
  private static readonly FERRY_DETOUR_FACTOR = 1.5; // Ferry routes are typically 50% longer
  private static readonly COMBINED_DETOUR_FACTOR = 1.4; // Combined routes are typically 40% longer

  /**
   * Calculate realistic route distance between two addresses
   * Considers road networks, ferry routes, and different transportation modes
   */
  static calculateRoute(from: Address, to: Address): RouteCalculation {
    // Check if coordinates are available
    if (!from.latitude || !from.longitude || !to.latitude || !to.longitude) {
      // Fallback to default coordinates if not available
      const defaultFrom = { ...from, latitude: 52.3676, longitude: 4.9041 }; // Amsterdam
      const defaultTo = { ...to, latitude: 52.3676, longitude: 4.9041 }; // Amsterdam
      return this.calculateRouteWithCoordinates(defaultFrom, defaultTo);
    }

    return this.calculateRouteWithCoordinates(from, to);
  }

  /**
   * Internal method to calculate route with guaranteed coordinates
   */
  private static calculateRouteWithCoordinates(from: Address & { latitude: number; longitude: number }, to: Address & { latitude: number; longitude: number }): RouteCalculation {
    const directDistance = this.calculateDirectDistance(from, to);
    const routeType = this.determineRouteType(from, to);
    
    let distance: number;
    let duration: number;
    
    switch (routeType) {
      case 'road':
        distance = directDistance * this.ROAD_DETOUR_FACTOR;
        duration = this.calculateRoadDuration(distance);
        break;
      case 'ferry':
        distance = directDistance * this.FERRY_DETOUR_FACTOR;
        duration = this.calculateFerryDuration(distance);
        break;
      case 'combined':
        distance = directDistance * this.COMBINED_DETOUR_FACTOR;
        duration = this.calculateCombinedDuration(distance);
        break;
      default:
        distance = directDistance * this.ROAD_DETOUR_FACTOR;
        duration = this.calculateRoadDuration(distance);
    }

    // Generate realistic waypoints for the route
    const waypoints = this.generateRouteWaypoints(from, to, routeType);

    return {
      distance: Math.round(distance),
      duration: Math.round(duration),
      routeType,
      waypoints
    };
  }

  /**
   * Calculate direct distance between two points using Haversine formula
   */
  private static calculateDirectDistance(from: Address, to: Address): number {
    const lat1 = from.latitude || 52.3676;
    const lng1 = from.longitude || 4.9041;
    const lat2 = to.latitude || 52.3676;
    const lng2 = to.longitude || 4.9041;

    const lat1Rad = (lat1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const deltaLatRad = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLngRad = ((lng2 - lng1) * Math.PI) / 180;

    const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return this.EARTH_RADIUS_KM * c;
  }

  /**
   * Determine the most likely route type based on geography
   */
  private static determineRouteType(from: Address, to: Address): 'road' | 'ferry' | 'combined' {
    const directDistance = this.calculateDirectDistance(from, to);
    
    // Check if route crosses major water bodies (simplified logic)
    const crossesWater = this.crossesMajorWaterBody(from, to);
    
    if (crossesWater && directDistance > 100) {
      return 'ferry';
    } else if (crossesWater && directDistance <= 100) {
      return 'combined';
    } else {
      return 'road';
    }
  }

  /**
   * Check if route crosses major water bodies (simplified geographic logic)
   */
  private static crossesMajorWaterBody(from: Address, to: Address): boolean {
    // Simplified logic - in reality, you'd use a proper geographic database
    // This checks for routes that might cross major water bodies
    
    // Check if route crosses North Sea, English Channel, or Mediterranean
    const fromLat = from.latitude || 52.3676;
    const fromLng = from.longitude || 4.9041;
    const toLat = to.latitude || 52.3676;
    const toLng = to.longitude || 4.9041;
    
    // North Sea crossing (rough approximation)
    if ((fromLat > 51 && fromLat < 60 && fromLng > -2 && fromLng < 8) &&
        (toLat > 51 && toLat < 60 && toLng > -2 && toLng < 8)) {
      return true;
    }
    
    // English Channel crossing
    if ((fromLat > 50 && fromLat < 51 && fromLng > -2 && fromLng < 2) &&
        (toLat > 50 && toLat < 51 && toLng > -2 && toLng < 2)) {
      return true;
    }
    
    // Mediterranean crossing
    if ((fromLat > 35 && fromLat < 45 && fromLng > -5 && fromLng < 35) &&
        (toLat > 35 && toLat < 45 && toLng > -5 && toLng < 35)) {
      return true;
    }
    
    return false;
  }

  /**
   * Calculate duration for road routes
   */
  private static calculateRoadDuration(distance: number): number {
    // Average truck speed: 80 km/h on highways, 50 km/h on local roads
    const averageSpeed = 65; // km/h
    return (distance / averageSpeed) * 60; // Convert to minutes
  }

  /**
   * Calculate duration for ferry routes
   */
  private static calculateFerryDuration(distance: number): number {
    // Ferry speed: 30 km/h average
    const ferrySpeed = 30; // km/h
    return (distance / ferrySpeed) * 60; // Convert to minutes
  }

  /**
   * Calculate duration for combined routes
   */
  private static calculateCombinedDuration(distance: number): number {
    // Combined average speed: 55 km/h
    const combinedSpeed = 55; // km/h
    return (distance / combinedSpeed) * 60; // Convert to minutes
  }

  /**
   * Generate realistic waypoints for the route
   */
  private static generateRouteWaypoints(
    from: Address, 
    to: Address, 
    routeType: 'road' | 'ferry' | 'combined'
  ): Array<{ lat: number; lng: number; type: 'pickup' | 'delivery' | 'waypoint' }> {
    const fromLat = from.latitude || 52.3676;
    const fromLng = from.longitude || 4.9041;
    const toLat = to.latitude || 52.3676;
    const toLng = to.longitude || 4.9041;

    const waypoints = [
      { lat: fromLat, lng: fromLng, type: 'pickup' as const }
    ];

    const directDistance = this.calculateDirectDistance(from, to);
    
    // Add intermediate waypoints based on route type and distance
    if (directDistance > 50) {
      const numWaypoints = Math.min(Math.floor(directDistance / 100), 5);
      
      for (let i = 1; i <= numWaypoints; i++) {
        const t = i / (numWaypoints + 1);
        const lat = fromLat + (toLat - fromLat) * t;
        const lng = fromLng + (toLng - fromLng) * t;
        
        // Add some realistic road-like curves
        const curveOffset = Math.sin(t * Math.PI) * 0.01;
        waypoints.push({
          lat: lat + curveOffset,
          lng: lng,
          type: 'waypoint'
        });
      }
    }

    waypoints.push({ lat: toLat, lng: toLng, type: 'delivery' as const });
    
    return waypoints;
  }

  /**
   * Get route information for display
   */
  static getRouteInfo(route: RouteCalculation): string {
    const hours = Math.floor(route.duration / 60);
    const minutes = route.duration % 60;
    
    let routeDescription = '';
    switch (route.routeType) {
      case 'road':
        routeDescription = 'Road route';
        break;
      case 'ferry':
        routeDescription = 'Ferry route';
        break;
      case 'combined':
        routeDescription = 'Combined route';
        break;
    }
    
    return `${routeDescription}: ${route.distance} km, ${hours}h ${minutes}m`;
  }
}
