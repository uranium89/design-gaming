# UI Review: S-012

## Status: PASS

## Loop 1

### Verified Elements
1. **TopBar Dropdown Integration**:
   - `Level 4: TinyURL - Dịch Vụ Rút Gọn Link Toàn Cầu` appears in the dropdown list.
   - Selecting Level 4 seamlessly resets simulation state, initializes budget limit to $350, and automatically triggers the Briefing Modal.
2. **Briefing Modal**:
   - Displays correct title, badge `Level 4: TinyURL`, context regarding 20:1 Read/Write ratio, and Hot Key event warning.
   - Action buttons ("Bắt đầu thử thách") function properly.
3. **Reference Architecture Visualization**:
   - Clean horizontal layout: User -> Load Balancer -> 3 App Servers Medium -> Redis Cache -> Master DB & 2 Read Replicas.
   - Cyan badges on Read Replicas clearly differentiate read-only nodes from the primary Master DB.
   - Particle streams accurately demonstrate write traffic concentrating into Master DB and read traffic dividing across Replicas.
