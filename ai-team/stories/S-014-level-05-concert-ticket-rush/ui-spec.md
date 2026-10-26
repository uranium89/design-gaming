# UI Specification: S-014 Màn 5 - Săn Vé Concert Black Friday (Level 05: Concert Ticket Rush)

## Screen & Flow Details
1. **TopBar Level Selector**:
   - Selector item added: `Level 5: Săn Vé Concert Black Friday (Concert Ticket Rush)`.
   - Badge display: `Level 5: Ticket Rush`.

2. **Scenario Info Banner / Briefing**:
   - Title: `Săn Vé Concert Black Friday`
   - Subtitle: `Black Friday Concert Ticket Rush: Event-Driven Architecture & Traffic Leveling`
   - Story Description:
     > "Ban nhạc rock huyền thoại mở bán 50,000 vé concert lúc 00:00 Black Friday! 15,000 fan cuồng đồng loạt ấn nút 'ĐẶT VÉ' (90% Write Traffic). Nếu ghi trực tiếp vào Database, toàn bộ cụm máy chủ cơ sở dữ liệu sẽ sập hoàn toàn vì quá tải IOPS. Hãy thiết kế kiến trúc bất đồng bộ dùng Message Queue để đệm đơn hàng tức thời và Worker Pool để ghi dữ liệu từ từ xuống Database, đảm bảo không mất bất kỳ chiếc vé nào!"
   - Constraints Badges:
     - Traffic: `15,000 RPS (90% Write)`
     - Budget Max: `$400/m`
     - P95 Latency: `<= 100ms`
     - Availability (SLA): `>= 99.9%`
     - Special Rule: `Zero Data Loss (Drop = 0%)`

3. **Victory & Scorecard State**:
   - 3 Stars: Zero drops, SLA >= 99.9%, Cost <= $320/m ($280/m reference architecture).
   - 2 Stars: Zero drops, SLA >= 99.0%, Cost <= $400/m.
   - 1 Star: Drops < 5%, SLA >= 95.0%.
   - 0 Stars: Database crashed or severe drop rate.

4. **Responsive Layout**:
   - Compatible with Desktop (1920x1080, 1440x900) and Tablet/Mobile viewports.
