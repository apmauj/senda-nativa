export function SquareSocialCard() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#fdf9ec',
        color: '#355b37',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -130,
          right: -120,
          width: 430,
          height: 430,
          borderRadius: 215,
          backgroundColor: '#e6efcf',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -165,
          left: -135,
          width: 420,
          height: 420,
          borderRadius: 210,
          backgroundColor: '#f3e6bd',
        }}
      />

      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          padding: '72px 84px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            borderRadius: 24,
            padding: '12px 22px',
            backgroundColor: '#dcecc9',
            color: '#356c3d',
            fontSize: 23,
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          JUEGO EDUCATIVO · 4 A 8 AÑOS
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            marginTop: 30,
            fontSize: 94,
            fontWeight: 900,
            letterSpacing: -2,
            lineHeight: 1,
          }}
        >
          <span style={{ color: '#28643c' }}>SENDA</span>
          <span style={{ color: '#e6a92e' }}>NATIVA</span>
        </div>

        <div
          style={{
            display: 'flex',
            maxWidth: 850,
            marginTop: 22,
            color: '#5e6252',
            fontSize: 31,
            fontWeight: 700,
            lineHeight: 1.35,
          }}
        >
          Tirá el dado, resolvé sumas y restas y recorré Uruguay.
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 370,
            height: 370,
            marginTop: 36,
            border: '12px solid #fffdf5',
            borderRadius: 200,
            backgroundColor: '#d4e7b8',
            boxShadow: '0 18px 35px rgba(53, 91, 55, 0.16)',
          }}
        >
          <svg width="310" height="310" viewBox="0 0 300 300" aria-hidden="true">
            <ellipse cx="150" cy="250" rx="82" ry="17" fill="rgba(82, 112, 61, 0.2)" />
            <circle cx="91" cy="91" r="32" fill="#a9744f" />
            <circle cx="209" cy="91" r="32" fill="#a9744f" />
            <circle cx="91" cy="91" r="16" fill="#d9b08c" />
            <circle cx="209" cy="91" r="16" fill="#d9b08c" />
            <path
              d="M72 153c0-58 31-98 78-98s78 40 78 98c0 42-16 72-43 86-11 6-23 9-35 9s-24-3-35-9c-27-14-43-44-43-86Z"
              fill="#a9744f"
            />
            <ellipse cx="150" cy="184" rx="69" ry="43" fill="#c89b72" />
            <circle cx="119" cy="137" r="11" fill="#fffdf5" />
            <circle cx="181" cy="137" r="11" fill="#fffdf5" />
            <circle cx="122" cy="139" r="5" fill="#3b2a20" />
            <circle cx="178" cy="139" r="5" fill="#3b2a20" />
            <ellipse cx="150" cy="178" rx="13" ry="9" fill="#3b2a20" />
            <path
              d="M150 186v9m0 0c-9 10-21 11-29 3m29-3c9 10 21 11 29 3"
              fill="none"
              stroke="#3b2a20"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div style={{ display: 'flex', gap: 14, marginTop: 30 }}>
          {[
            ['SUMAS', '#f7e4aa'],
            ['RESTAS', '#dbe9c4'],
            ['ANIMALES DEL URUGUAY', '#f2dfd0'],
          ].map(([label, background]) => (
            <div
              key={label}
              style={{
                display: 'flex',
                borderRadius: 20,
                padding: '12px 17px',
                backgroundColor: background,
                color: '#5f5b48',
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: 0.4,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

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
