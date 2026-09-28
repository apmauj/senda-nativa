export function SocialCard() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#fdf9ec",
        color: "#355b37",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 500,
          height: 630,
          borderTopLeftRadius: 260,
          borderBottomLeftRadius: 260,
          backgroundColor: "#e6efcf",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -145,
          left: -125,
          width: 350,
          height: 350,
          borderRadius: 175,
          backgroundColor: "#f3e6bd",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: "100%",
          padding: "58px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: 650,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              borderRadius: 24,
              padding: "10px 18px",
              backgroundColor: "#dcecc9",
              color: "#356c3d",
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: 1,
            }}
          >
            JUEGO EDUCATIVO · 4 A 8 AÑOS
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 24,
              fontSize: 83,
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: -3,
            }}
          >
            <span style={{ color: "#28643c" }}>SENDA</span>
            <span style={{ color: "#e6a92e" }}>NATIVA</span>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 20,
              maxWidth: 590,
              color: "#5e6252",
              fontSize: 25,
              fontWeight: 700,
              lineHeight: 1.35,
            }}
          >
            Tirá el dado, resolvé sumas y restas y recorré Uruguay junto a sus animales autóctonos.
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 23 }}>
            {[
              ["SUMAS", "#f7e4aa"],
              ["RESTAS", "#dbe9c4"],
              ["ANIMALES DEL URUGUAY", "#f2dfd0"],
            ].map(([label, background]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  borderRadius: 18,
                  padding: "9px 13px",
                  backgroundColor: background,
                  color: "#5f5b48",
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: 0.4,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            height: 100,
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 370,
              height: 370,
              border: "12px solid #fffdf5",
              borderRadius: 185,
              backgroundColor: "#d4e7b8",
              boxShadow: "0 18px 35px rgba(53, 91, 55, 0.16)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 41,
                left: 42,
                width: 48,
                height: 48,
                borderRadius: 14,
                backgroundColor: "#f1bd4e",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 34,
                bottom: 55,
                width: 55,
                height: 55,
                border: "6px solid #fffdf5",
                borderRadius: 17,
                backgroundColor: "#7cae67",
              }}
            />

            <div
              style={{
                position: "absolute",
                bottom: 47,
                width: 202,
                height: 48,
                borderRadius: 50,
                backgroundColor: "rgba(82, 112, 61, 0.2)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 99,
                left: 79,
                width: 185,
                height: 178,
                borderRadius: "74px 74px 62px 62px",
                backgroundColor: "#a9744f",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 83,
                left: 105,
                width: 42,
                height: 42,
                borderRadius: 22,
                backgroundColor: "#a9744f",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 83,
                right: 105,
                width: 42,
                height: 42,
                borderRadius: 22,
                backgroundColor: "#a9744f",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 91,
                left: 115,
                width: 22,
                height: 22,
                borderRadius: 12,
                backgroundColor: "#d9b08c",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 91,
                right: 115,
                width: 22,
                height: 22,
                borderRadius: 12,
                backgroundColor: "#d9b08c",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 151,
                left: 119,
                width: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: "#fffdf5",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 151,
                right: 119,
                width: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: "#fffdf5",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 157,
                left: 126,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#3b2a20",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 157,
                right: 126,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#3b2a20",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 176,
                left: 96,
                width: 150,
                height: 72,
                borderRadius: 38,
                backgroundColor: "#c89b72",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 193,
                left: 163,
                width: 17,
                height: 12,
                borderRadius: 9,
                backgroundColor: "#3b2a20",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 207,
                left: 151,
                width: 40,
                height: 15,
                borderBottom: "4px solid #3b2a20",
                borderRadius: "0 0 50% 50%",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
