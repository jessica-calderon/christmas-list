export default function SnowOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Snow container with gradient opacity mask - reduced opacity in top 150px */}
      <div 
        className="absolute inset-0"
        style={{
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 150px, rgba(0,0,0,1) 200px)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 150px, rgba(0,0,0,1) 200px)',
        }}
      >
        <div className="snowflakes">
          <div className="snowflake">❄</div>
          <div className="snowflake">❄</div>
          <div className="snowflake">❄</div>
          <div className="snowflake">❄</div>
          <div className="snowflake">❄</div>
          <div className="snowflake">❄</div>
          <div className="snowflake">❄</div>
          <div className="snowflake">❄</div>
          <div className="snowflake">❄</div>
          <div className="snowflake">❄</div>
          <div className="snowflake">❄</div>
          <div className="snowflake">❄</div>
        </div>
      </div>
    </div>
  );
}

