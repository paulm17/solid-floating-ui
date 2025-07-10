import { createSignal, createEffect, onCleanup, For } from 'solid-js';
import { render } from 'solid-js/web';
import { offset, arrow, autoUpdate, flip, shift } from '@floating-ui/dom';
import FloatingArrow from '../components/floating-arrow';
import { useFloating } from '../hooks/use-floating';

export default { title: 'Solid: FloatingArrow' };

// Mock implementation for the hooks since we don't have the actual files
const useId = () => `floating-${Math.random().toString(36).substr(2, 9)}`;

// Basic example with default settings
export const Basic = () => {
  const [referenceEl, setReferenceEl] = createSignal<HTMLElement>();
  const [floatingEl, setFloatingEl] = createSignal<HTMLElement>();
  const [arrowEl, setArrowEl] = createSignal<SVGSVGElement>();
  const [isOpen, setIsOpen] = createSignal(false);

  const floating = useFloating({
    placement: 'top',
    open: isOpen,
    elements: () => ({
      reference: referenceEl(),
      floating: floatingEl()
    }),
    middleware: () => [
      offset(10),
      flip(),
      shift({ padding: 5 }),
      ...(arrowEl() ? [arrow({ element: arrowEl()! })] : [])
    ],
    whileElementsMounted: autoUpdate
  });

  return (
    <div style={{ padding: '50px', display: 'flex', 'flex-direction': 'column', gap: '20px' }}>
      <button
        ref={setReferenceEl}
        onClick={() => setIsOpen(!isOpen())}
        style={{
          padding: '10px 20px',
          'background-color': '#007bff',
          color: 'white',
          border: 'none',
          'border-radius': '4px',
          cursor: 'pointer',
          width: 'fit-content'
        }}
      >
        Toggle Tooltip
      </button>

      {isOpen() && (
        <div
          ref={setFloatingEl}
          style={`
            ${floating.floatingStyles};
            background-color: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 1000;
          `}
        >
          Basic tooltip with arrow
          <FloatingArrow
            ref={setArrowEl}
            context={floating.context}
            fill="#333"
          />
        </div>
      )}
    </div>
  );
};

// Different placements
export const Placements = () => {
  const [referenceEl, setReferenceEl] = createSignal<HTMLElement>();
  const [floatingEl, setFloatingEl] = createSignal<HTMLElement>();
  const [arrowEl, setArrowEl] = createSignal<SVGSVGElement>();
  const [placement, setPlacement] = createSignal<any>('top');
  const [isOpen, setIsOpen] = createSignal(true);

  const floating = useFloating({
    placement: () => placement(),
    open: isOpen,
    elements: () => ({
      reference: referenceEl(),
      floating: floatingEl()
    }),
    middleware: () => [
      offset(10),
      flip(),
      shift({ padding: 5 }),
      ...(arrowEl() ? [arrow({ element: arrowEl()! })] : [])
    ],
    whileElementsMounted: autoUpdate
  });

  const placements = [
    'top', 'top-start', 'top-end',
    'right', 'right-start', 'right-end',
    'bottom', 'bottom-start', 'bottom-end',
    'left', 'left-start', 'left-end'
  ] as const;

  return (
    <div style={{ padding: '100px', display: 'flex', 'flex-direction': 'column', gap: '20px', 'align-items': 'center' }}>
      <div style={{ display: 'flex', gap: '10px', 'flex-wrap': 'wrap', 'justify-content': 'center' }}>
        {placements.map(p => (
          <button
            onClick={() => setPlacement(p)}
            style={{
              padding: '5px 10px',
              'background-color': placement() === p ? '#007bff' : '#f8f9fa',
              color: placement() === p ? 'white' : 'black',
              border: '1px solid #dee2e6',
              'border-radius': '4px',
              cursor: 'pointer',
              'font-size': '12px'
            }}
          >
            {p}
          </button>
        ))}
      </div>

      <div
        ref={setReferenceEl}
        style={{
          padding: '20px',
          'background-color': '#e9ecef',
          'border-radius': '4px',
          'text-align': 'center'
        }}
      >
        Reference Element
      </div>

      {isOpen() && (
        <div
          ref={setFloatingEl}
          style={`
            ${floating.floatingStyles};
            background-color: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 1000;
          `}
        >
          Placement: {placement()}
          <FloatingArrow
            ref={setArrowEl}
            context={floating.context}
            fill="#333"
          />
        </div>
      )}
    </div>
  );
};

// Custom styling
export const CustomStyling = () => {
  const [referenceEl, setReferenceEl] = createSignal<HTMLElement>();
  const [floatingEl, setFloatingEl] = createSignal<HTMLElement>();
  const [arrowEl, setArrowEl] = createSignal<SVGSVGElement>();

  const floating = useFloating({
    placement: 'top',
    open: true,
    elements: () => ({
      reference: referenceEl(),
      floating: floatingEl()
    }),
    middleware: () => [
      offset(15),
      ...(arrowEl() ? [arrow({ element: arrowEl()! })] : [])
    ],
    whileElementsMounted: autoUpdate
  });

  return (
    <div style={{ padding: '50px', display: 'flex', gap: '50px', 'flex-wrap': 'wrap' }}>
      {/* Large arrow */}
      <div>
        <div
          ref={setReferenceEl}
          style={{
            padding: '15px',
            'background-color': '#007bff',
            color: 'white',
            'border-radius': '8px',
            'text-align': 'center',
            'margin-bottom': '20px'
          }}
        >
          Large Arrow
        </div>

        <div
          ref={setFloatingEl}
          style={`
            ${floating.floatingStyles};
            background-color: #28a745;
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 16px;
            z-index: 1000;
          `}
        >
          Custom large arrow
          <FloatingArrow
            ref={setArrowEl}
            context={floating.context}
            width={24}
            height={12}
            fill="#28a745"
          />
        </div>
      </div>
    </div>
  );
};

// With border/stroke
export const WithBorder = () => {
  const [referenceEl, setReferenceEl] = createSignal<HTMLElement>();
  const [floatingEl, setFloatingEl] = createSignal<HTMLElement>();
  const [arrowEl, setArrowEl] = createSignal<SVGSVGElement>();

  const floating = useFloating({
    placement: 'right',
    open: true,
    elements: () => ({
      reference: referenceEl(),
      floating: floatingEl()
    }),
    middleware: () => [
      offset(10),
      ...(arrowEl() ? [arrow({ element: arrowEl()! })] : [])
    ],
    whileElementsMounted: autoUpdate
  });

  return (
    <div style={{ padding: '50px' }}>
      <div
        ref={setReferenceEl}
        style={{
          padding: '15px',
          'background-color': '#6c757d',
          color: 'white',
          'border-radius': '4px',
          'text-align': 'center',
          width: 'fit-content'
        }}
      >
        Reference
      </div>

      <div
        ref={setFloatingEl}
        style={{
          position: floating.strategy,
          top: `${floating.y ?? 0}px`,
          left: `${floating.x ?? 0}px`,
          'background-color': 'white',
          color: '#333',
          padding: '12px 16px',
          'border-radius': '6px',
          'font-size': '14px',
          'z-index': '1000',
          border: '2px solid #007bff',
          'box-shadow': '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        Tooltip with border
        <FloatingArrow
          ref={setArrowEl}
          context={floating.context}
          fill="white"
          stroke="#007bff"
          strokeWidth={2}
        />
      </div>
    </div>
  );
};

// Rounded tip
export const RoundedTip = () => {
  const [referenceEl, setReferenceEl] = createSignal<HTMLElement>();
  const [floatingEl, setFloatingEl] = createSignal<HTMLElement>();
  const [arrowEl, setArrowEl] = createSignal<SVGSVGElement>();

  const floating = useFloating({
    placement: 'bottom',
    open: true,
    elements: () => ({
      reference: referenceEl(),
      floating: floatingEl()
    }),
    middleware: () => [
      offset(10),
      ...(arrowEl() ? [arrow({ element: arrowEl()! })] : [])
    ],
    whileElementsMounted: autoUpdate
  });

  return (
    <div style={{ padding: '50px' }}>
      <div
        ref={setReferenceEl}
        style={{
          padding: '15px',
          'background-color': '#17a2b8',
          color: 'white',
          'border-radius': '8px',
          'text-align': 'center',
          width: 'fit-content'
        }}
      >
        Rounded Arrow
      </div>

      <div
        ref={setFloatingEl}
        style={{
          position: floating.strategy,
          top: `${floating.y ?? 0}px`,
          left: `${floating.x ?? 0}px`,
          'background-color': '#f8f9fa',
          color: '#333',
          padding: '12px 16px',
          'border-radius': '8px',
          'font-size': '14px',
          'z-index': '1000',
          border: '1px solid #dee2e6'
        }}
      >
        Arrow with rounded tip
        <FloatingArrow
          ref={setArrowEl}
          context={floating.context}
          fill="#f8f9fa"
          stroke="#dee2e6"
          strokeWidth={1}
          tipRadius={2}
        />
      </div>
    </div>
  );
};

// Interactive controls
export const Interactive = () => {
  const [referenceEl, setReferenceEl] = createSignal<HTMLElement>();
  const [floatingEl, setFloatingEl] = createSignal<HTMLElement>();
  const [arrowEl, setArrowEl] = createSignal<SVGSVGElement>();

  const [width, setWidth] = createSignal(14);
  const [height, setHeight] = createSignal(7);
  const [tipRadius, setTipRadius] = createSignal(0);
  const [strokeWidth, setStrokeWidth] = createSignal(0);
  const [fill, setFill] = createSignal('#333');
  const [stroke, setStroke] = createSignal('#666');

  const floating = useFloating({
    placement: 'top',
    open: true,
    elements: () => ({
      reference: referenceEl(),
      floating: floatingEl()
    }),
    middleware: () => [
      offset(10),
      ...(arrowEl() ? [arrow({ element: arrowEl()! })] : [])
    ],
    whileElementsMounted: autoUpdate
  });

  const ControlGroup = (props: { label: string; children: any }) => (
    <div style={{ display: 'flex', 'flex-direction': 'column', gap: '5px' }}>
      <label style={{ 'font-weight': 'bold', 'font-size': '12px' }}>{props.label}</label>
      {props.children}
    </div>
  );

  return (
    <div style={{ padding: '50px', display: 'flex', gap: '50px' }}>
      <div style={{ display: 'flex', 'flex-direction': 'column', gap: '20px', 'min-width': '200px' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Controls</h3>

        <ControlGroup label="Width">
          <input
            type="range"
            min="8"
            max="30"
            value={width()}
            onInput={(e) => setWidth(Number(e.target.value))}
          />
          <span style={{ 'font-size': '12px' }}>{width()}px</span>
        </ControlGroup>

        <ControlGroup label="Height">
          <input
            type="range"
            min="4"
            max="20"
            value={height()}
            onInput={(e) => setHeight(Number(e.target.value))}
          />
          <span style={{ 'font-size': '12px' }}>{height()}px</span>
        </ControlGroup>

        <ControlGroup label="Tip Radius">
          <input
            type="range"
            min="0"
            max="8"
            value={tipRadius()}
            onInput={(e) => setTipRadius(Number(e.target.value))}
          />
          <span style={{ 'font-size': '12px' }}>{tipRadius()}</span>
        </ControlGroup>

        <ControlGroup label="Stroke Width">
          <input
            type="range"
            min="0"
            max="4"
            value={strokeWidth()}
            onInput={(e) => setStrokeWidth(Number(e.target.value))}
          />
          <span style={{ 'font-size': '12px' }}>{strokeWidth()}px</span>
        </ControlGroup>

        <ControlGroup label="Fill Color">
          <input
            type="color"
            value={fill()}
            onInput={(e) => setFill(e.target.value)}
          />
        </ControlGroup>

        <ControlGroup label="Stroke Color">
          <input
            type="color"
            value={stroke()}
            onInput={(e) => setStroke(e.target.value)}
          />
        </ControlGroup>
      </div>

      <div>
        <div
          ref={setReferenceEl}
          style={{
            padding: '15px',
            'background-color': '#6f42c1',
            color: 'white',
            'border-radius': '4px',
            'text-align': 'center',
            width: 'fit-content'
          }}
        >
          Interactive Arrow
        </div>

        <div
          ref={setFloatingEl}
          style={{
            position: floating.strategy,
            top: `${floating.y ?? 0}px`,
            left: `${floating.x ?? 0}px`,
            'background-color': fill(),
            color: fill() === '#ffffff' || fill() === '#fff' ? '#333' : 'white',
            padding: '12px 16px',
            'border-radius': '6px',
            'font-size': '14px',
            'z-index': '1000',
            border: strokeWidth() > 0 ? `${strokeWidth()}px solid ${stroke()}` : 'none'
          }}
        >
          Customizable arrow
          <FloatingArrow
            ref={setArrowEl}
            context={floating.context}
            width={width()}
            height={height()}
            tipRadius={tipRadius()}
            strokeWidth={strokeWidth()}
            fill={fill()}
            stroke={stroke()}
          />
        </div>
      </div>
    </div>
  );
};

// Multiple arrows example
export const MultipleArrows = () => {
  const examples = [
    { placement: 'top' as const, color: '#007bff', label: 'Blue Top' },
    { placement: 'right' as const, color: '#28a745', label: 'Green Right' },
    { placement: 'bottom' as const, color: '#ffc107', label: 'Yellow Bottom' },
    { placement: 'left' as const, color: '#dc3545', label: 'Red Left' }
  ];

  return (
    <div style={{ padding: '100px', display: 'grid', 'grid-template-columns': '1fr 1fr', gap: '100px' }}>
      <For each={examples}>
        {(example) => {
          const [referenceEl, setReferenceEl] = createSignal<HTMLElement>();
          const [floatingEl, setFloatingEl] = createSignal<HTMLElement>();
          const [arrowEl, setArrowEl] = createSignal<SVGSVGElement>();

          const floating = useFloating({
            placement: example.placement,
            open: true,
            elements: () => ({
              reference: referenceEl(),
              floating: floatingEl()
            }),
            middleware: () => [
              offset(10),
              ...(arrowEl() ? [arrow({ element: arrowEl()! })] : [])
            ],
            whileElementsMounted: autoUpdate
          });

          return (
            <div>
              <div
                ref={setReferenceEl}
                style={{
                  padding: '15px',
                  'background-color': '#f8f9fa',
                  border: '2px solid #dee2e6',
                  'border-radius': '4px',
                  'text-align': 'center',
                  'font-weight': 'bold'
                }}
              >
                {example.label}
              </div>

              <div
                ref={setFloatingEl}
                style={{
                  position: floating.strategy,
                  top: `${floating.y ?? 0}px`,
                  left: `${floating.x ?? 0}px`,
                  'background-color': example.color,
                  color: 'white',
                  padding: '10px 15px',
                  'border-radius': '4px',
                  'font-size': '13px',
                  'z-index': '1000'
                }}
              >
                {example.placement} tooltip
                <FloatingArrow
                  ref={setArrowEl}
                  context={floating.context}
                  fill={example.color}
                />
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
};
