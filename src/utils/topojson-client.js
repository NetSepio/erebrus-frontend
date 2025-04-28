/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
// @/utils/topojson-client.js
export const feature = function(topology, object) {
    if (typeof object === "string") object = topology.objects[object];
    return object.type === "GeometryCollection"
      ? {type: "FeatureCollection", features: object.geometries.map(geometry => feature$1(topology, geometry))}
      : feature$1(topology, object);
  };
  
  function feature$1(topology, o) {
    var id = o.id,
        bbox = o.bbox,
        properties = o.properties || {},
        geometry = object(topology, o);
    return {type: "Feature", id: id, properties: properties, geometry: geometry, bbox: bbox};
  }
  
  function object(topology, o) {
    var transformPoint = transform(topology.transform),
        arcs = topology.arcs;
  
    function arc(i, points) {
      if (points.length) points.pop();
      for (var a = arcs[i < 0 ? ~i : i], k = 0, n = a.length; k < n; ++k) {
        points.push(transformPoint(a[k], k));
      }
      if (i < 0) reverse(points, n);
    }
  
    function point(p) {
      return transformPoint(p);
    }
  
    function line(arcs) {
      var points = [];
      for (var i = 0, n = arcs.length; i < n; ++i) arc(arcs[i], points);
      if (points.length < 2) points.push(points[0]);
      return points;
    }
  
    function ring(arcs) {
      var points = line(arcs);
      while (points.length < 4) points.push(points[0]);
      return points;
    }
  
    function polygon(arcs) {
      return arcs.map(ring);
    }
  
    function geometry(o) {
      var type = o.type, coordinates;
      switch (type) {
        case "GeometryCollection": return {type: type, geometries: o.geometries.map(geometry)};
        case "Point": coordinates = point(o.coordinates); break;
        case "MultiPoint": coordinates = o.coordinates.map(point); break;
        case "LineString": coordinates = line(o.arcs); break;
        case "MultiLineString": coordinates = o.arcs.map(line); break;
        case "Polygon": coordinates = polygon(o.arcs); break;
        case "MultiPolygon": coordinates = o.arcs.map(polygon); break;
        default: return null;
      }
      return {type: type, coordinates: coordinates};
    }
  
    return geometry(o);
  }
  // @/utils/topojson-client.js (continued)
function transform(transform) {
    if (transform == null) return identity;
    var x0,
        y0,
        kx = transform.scale[0],
        ky = transform.scale[1],
        dx = transform.translate[0],
        dy = transform.translate[1];
    return function(point, i) {
      if (!i) x0 = y0 = 0;
      var x1 = Math.round((point[0] - x0) * kx),
          y1 = Math.round((point[1] - y0) * ky);
      x0 = point[0], y0 = point[1];
      return [x1 + dx, y1 + dy];
    };
  }
  
  function identity(point) {
    return point;
  }
  
  function reverse(array, n) {
    var t, j = array.length, i = j - n;
    while (i < --j) t = array[i], array[i++] = array[j], array[j] = t;
  }
  
  export const mesh = function(topology, object, filter) {
    return object.type === "GeometryCollection"
        ? {type: "GeometryCollection", geometries: object.geometries.map(function(geometry) {
            return mesh$1(topology, geometry, filter);
          })}
        : mesh$1(topology, object, filter);
  };
  
  function mesh$1(topology, object, filter) {
    var arcs = [];
  
    function arc(i) {
      var j = i < 0 ? ~i : i;
      (geomArcs[j] || (geomArcs[j] = [])).push({i: i, g: geom});
    }
  
    function line(arcs) {
      arcs.forEach(arc);
    }
  
    function polygon(arcs) {
      arcs.forEach(line);
    }
  
    function geometry(o) {
      if (o.type === "GeometryCollection") o.geometries.forEach(geometry);
      else if (o.type in geometryType) geom = o, geometryType[o.type](o.arcs);
    }
  
    var geomArcs = [],
        geom;
  
    var geometryType = {
      LineString: line,
      MultiLineString: polygon,
      Polygon: polygon,
      MultiPolygon: function(arcs) { arcs.forEach(polygon); }
    };
  
    geometry(object);
  
    geomArcs.forEach(filter == null
        ? function(o) { arcs.push(o.i); }
        : function(o) { if (filter(o.i, o.g)) arcs.push(o.i); });
  
    return {type: "MultiLineString", arcs: merge(topology, arcs)};
  }
  
  function merge(topology, arcs) {
    var graph = {},
        fragmentByStart = {},
        fragmentByEnd = {},
        fragments = [],
        emptyIndex = -1;
  
    // Stitch empty arcs first, since they may be subsumed by other arcs.
    arcs.forEach(function(i, j) {
      var arc = topology.arcs[i < 0 ? ~i : i], t;
      if (arc.length < 3 && !arc[1][0] && !arc[1][1]) {
        t = arcs[++emptyIndex], arcs[emptyIndex] = i, arcs[j] = t;
      }
    });
  
    return arcs.map(function(i) {
      return i;
    });
  }